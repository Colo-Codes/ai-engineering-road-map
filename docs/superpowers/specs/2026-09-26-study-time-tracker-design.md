# Study time tracker — design

Date: 2026-09-26
Status: approved in conversation, awaiting spec review

## Purpose

Track how much time is spent studying the roadmap, split between **theory** (a lesson's learning outcomes) and **exercises**, per individual lesson. Also cover personal projects and untargeted general study. The tracker must be one click away on every page, never lose a session, let mistakes be corrected afterwards, and show where the time went.

### Success criteria

- A timer for the lesson on screen starts in one click from any view.
- Sessions support pause and resume. A session's duration excludes paused time.
- The start and finish date and time of every active interval are logged.
- Any session can be edited (target, note, individual intervals), added manually or deleted.
- A dashboard shows totals, trends, a per-module/per-lesson breakdown and a session log.
- Logged time is visible next to each lesson's theory and exercise, each exercise row and each personal project.
- A running or paused session survives page reloads and dev-server restarts.

### Decisions taken

| Question | Decision |
|---|---|
| How the timer picks its target | Context-aware: it defaults to the currently selected lesson and can be changed through a picker. Start buttons also appear on lesson and exercise UI. |
| Pausing | Pause and resume within a session (a session has many intervals). |
| Editing | Full: target, note and each interval's start/finish, plus manual add and delete. |
| Dashboard | Totals and trends, breakdown by module/lesson, session log, and time shown on lesson pages. |
| Trackable targets | Lesson theory, lesson exercise, personal projects, general study. |
| Placement | Card in the sidebar footer on desktop; floating pill below 760px. |

### Out of scope

Idle detection or long-running reminders, study goals or targets, data export, keyboard shortcuts, and multi-user support.

## 1. Data model

Both tables are created in `ensureCatalogSchema` (`server/database.ts`) with `CREATE TABLE IF NOT EXISTS`, so existing databases gain them without migration risk. The seed database and the sync script are untouched: these are user-state tables, created at server start like `exercise_checklist`.

```sql
CREATE TABLE IF NOT EXISTS study_sessions (
  id           TEXT PRIMARY KEY,
  target_type  TEXT NOT NULL CHECK (target_type IN ('lesson', 'project', 'general')),
  topic_id     TEXT,
  kind         TEXT CHECK (kind IN ('theory', 'exercise')),
  project_id   TEXT,
  target_label TEXT NOT NULL,
  note         TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL CHECK (status IN ('running', 'paused', 'finished')),
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS study_intervals (
  id          INTEGER PRIMARY KEY,
  session_id  TEXT NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
  started_at  TEXT NOT NULL,
  ended_at    TEXT
);
CREATE INDEX IF NOT EXISTS study_intervals_session ON study_intervals (session_id, started_at);
```

Field rules by `target_type`:

| `target_type` | `topic_id` | `kind` | `project_id` | `target_label` |
|---|---|---|---|---|
| `lesson` | required | required | NULL | lesson title at the time of logging |
| `project` | NULL | NULL | required | project title at the time of logging |
| `general` | NULL | NULL | NULL | user label, defaulting to "General study" |

- **No foreign keys to `topics` or `custom_projects`.** Catalogue resyncs delete lessons that leave the Markdown, and `replaceCustomProjects` deletes and reinserts every project on each save. A cascade would erase logged time. `target_label` keeps history readable when the target no longer exists.
- **Timestamps** are ISO 8601 UTC strings produced by the server (`new Date().toISOString()`) or validated client input. They are displayed in local time.

### Invariants (enforced by the server on every write)

1. At most one session has status `running` or `paused`.
2. A `running` session has exactly one interval with `ended_at IS NULL`, and it is the latest. `paused` and `finished` sessions have no open interval.
3. Every session has at least one interval.
4. Within a session, intervals are ordered by start time, each closed interval has `ended_at > started_at`, and intervals don't overlap.
5. No timestamp is later than the server's current time (a small tolerance of a few seconds is allowed for clock skew).

Duration is always computed as the sum of `ended_at − started_at` over closed intervals, plus `now − started_at` for the open interval. It is never stored.

## 2. Server API

Handlers are added to the existing `/api` middleware in `vite.config.ts`, following the current validation and `sendJson` style. The database functions live in `server/database.ts` and are exposed on `RoadmapDatabase`.

Shared JSON shape (the TypeScript types are duplicated in `server/database.ts` and `src/types.ts`, as the existing types are):

```ts
type StudyKind = 'theory' | 'exercise'
type StudyTarget =
  | { type: 'lesson'; topicId: string; kind: StudyKind; label: string }
  | { type: 'project'; projectId: string; label: string }
  | { type: 'general'; label: string }
type StudyStatus = 'running' | 'paused' | 'finished'
type StudyInterval = { startedAt: string; endedAt: string | null }
type StudySession = { id: string; target: StudyTarget; note: string; status: StudyStatus; createdAt: string; intervals: StudyInterval[] }
```

| Method | Path | Body | Behaviour | Returns |
|---|---|---|---|---|
| GET | `/api/study-sessions` | none | All sessions with intervals, newest first | `{ sessions }` |
| POST | `/api/study-timer` | `{ action: 'start', target }` | Finishes any active session (closing its open interval at now), then creates a `running` session with one open interval starting now | `{ sessions }` |
| POST | `/api/study-timer` | `{ action: 'pause' }` | Closes the active session's open interval and sets the status to `paused`. Fails with 409 if nothing is running. | `{ sessions }` |
| POST | `/api/study-timer` | `{ action: 'resume' }` | Opens a new interval at now and sets the status to `running`. Fails with 409 if nothing is paused. | `{ sessions }` |
| POST | `/api/study-timer` | `{ action: 'stop' }` | Closes any open interval and sets the status to `finished`. Fails with 409 if no session is active. | `{ sessions }` |
| POST | `/api/study-sessions` | `{ target, note, intervals }` | Creates a `finished` session. All intervals must be closed. | `{ sessions }` |
| PUT | `/api/study-sessions/:id` | `{ target, note, intervals }` | Replaces the target and note. Intervals are replaced only for `finished` sessions. For an active session, the `intervals` field is ignored. | `{ sessions }` |
| DELETE | `/api/study-sessions/:id` | none | Deletes the session. Deleting the active session is allowed. | `{ sessions }` |

- Every mutation runs in a `database.transaction` and returns the full, fresh session list. The client never has to reconcile partial state, and the data volume is small (hundreds or low thousands of rows).
- Validation failures return 400 with a UK-English `error` message, for example "Each interval must end after it starts." An unknown session id returns 404.
- The server generates session ids with `crypto.randomUUID()`.

The admin view (`getAdminData`) gains two entries:
- `study_sessions`: label "Study sessions", description "Timed study sessions and what they were for."
- `study_intervals`: label "Study intervals", description "The active periods within each study session."

## 3. Client state

**`src/api.ts`** gains typed functions for the endpoints above: `loadStudySessions`, `studyTimerAction`, `createStudySession`, `updateStudySession`, `deleteStudySession`.

**`src/hooks/useStudyTracker.ts`**, separate from `useRoadmapData` because this data is row-based rather than snapshot-and-save:

- Loads the sessions on mount and exposes `sessions`, `activeSession`, `ready` and `error`.
- Exposes `start(target)`, `pause()`, `resume()`, `stop()`, `create(input)`, `update(id, input)` and `remove(id)`. Each calls the API and replaces `sessions` with the response.
- Failed mutations surface as `error` (shown in the tracker) and don't change local state.
- Exposes `timeByTarget`, a memoised lookup built by `lib/studyTime`, used for time shown in context.

**`src/hooks/useNow.ts`** returns `Date.now()` and re-renders every second while `enabled`. It is used only by components that display a live clock, so the rest of the tree doesn't re-render every second.

`App.tsx` calls `useStudyTracker()` once and passes what each part needs as props, as it already does with `useRoadmapData`.

## 4. Pure helpers

**`src/lib/studyTime.ts`:**

- `sessionDuration(session, now)` returns milliseconds.
- `splitByDay(session, now)` returns an array of `{ day: 'YYYY-MM-DD' (local), ms }`, splitting intervals at local midnight.
- `studyCategory(session)` returns `'theory' | 'exercise' | 'project' | 'general'`.
- `timeByTarget(sessions, now)` returns a map from a key (`lesson:<topicId>:<kind>`, `project:<projectId>`) to milliseconds.
- `dailyTotals(sessions, days, now)` returns the last N local days, each with ms per category.
- `summaryStats(sessions, now)` returns today, this week (starting Monday), all time, streak (consecutive local days ending today or yesterday that have any logged time), and ms per category.
- `moduleBreakdown(sessions, phases, now)` returns, per module, theory, exercise and total ms plus per-lesson rows. Personal projects and general study are returned as separate trailing groups. Lesson sessions whose `topicId` is no longer in the catalogue go in a "Lessons no longer in the roadmap" group.
- `validateIntervals(intervals, now)` returns an error message or `null`. It is shared by the edit dialog; the server has its own equivalent check.

**`src/lib/format.ts`** gains:
- `formatDuration(ms)` for durations: "45 min", "1 h 05 min", "12 h 30 min". Anything under a minute shows as "< 1 min".
- `formatClock(ms)` for the live clock: "42:07", "1:02:15".

## 5. Tracker UI

### Shared components (`src/components/`)

- **`StudyTracker.tsx`**: the always-visible tracker, rendered once in `Sidebar` as the first item in `.sidebar-footer`.
  - At 760px and above, it shows as a card in the sidebar footer.
  - Below 760px, `App` renders a second copy as the mobile pill (see below).
  - Both copies use the same component with a `variant: 'card' | 'pill'` prop.
- **`StudyTargetPicker.tsx`**: controlled form fields for choosing a target.
  - Segmented choice: Lesson, Personal project, or General study.
  - Lesson: a module select, a lesson select, then a theory/exercise segmented choice.
  - Personal project: a project select. Disabled with a hint if there are no projects.
  - General study: a free-text label.
  - Used by the tracker's change dialog and by the session edit dialog.
- **`StudyTimerButton.tsx`**: a small inline button for a specific target.
  - When that target is not active, it shows a timer icon and "Start" and calls `start(target)`.
  - When it is the running target, it shows a live "Timing 12:30" chip; clicking pauses.
  - When it is the paused target, it shows "Paused 12:30"; clicking resumes.

### Tracker states

The default target is the lesson currently selected in `App` (`selected`), which persists across views.

- **Idle:**
  - A "Study timer" label, then the suggested lesson ("Lesson 3 · Tokenisation").
  - Two buttons: **Theory** and **Exercise** (each starts that kind).
  - A **Change** link that opens a `Modal` containing `StudyTargetPicker` and a **Start** button.
- **Running:**
  - The target label and a category chip.
  - The live clock (`formatClock`).
  - **Pause** and **Stop** buttons.
- **Paused:**
  - A frozen, dimmed clock with a "Paused" chip.
  - **Resume** and **Stop** buttons.
- **After Stop:** an inline message, "Logged 42 min · Add note", for about 6 seconds. "Add note" opens that session's edit dialog.

### Behaviour

- **Switching:** starting a different target while a session is active finishes the current session automatically, with no confirmation.
- **Colours:** category colours come from four CSS custom properties reused throughout the feature: `--study-theory` (the learning purple used by `GoalCard`), `--study-exercise` (the building colour), `--study-project` and `--study-general`.
- **Tab title:** while a session is running, `document.title` becomes `▶ 42:07 · <target label>`. While it is paused, it becomes `❚❚ <target label>`. Otherwise it reverts to the original title.

### Mobile pill (below 760px)

- **Idle:** a small fixed button at the bottom right reading "Start timer". It opens the full card as a bottom sheet (`Modal`).
- **Active:** a fixed pill showing the category dot, the clock, Pause/Resume and Stop. Tapping the label opens the full card in the sheet.
- The pill is hidden while the mobile navigation is open, since the sidebar card is visible then.

### Start buttons in context

- **`LessonPanel`:**
  - Learning outcomes `GoalCard`: a `StudyTimerButton` for `{ lesson, theory }` and a "2 h 15 min logged" line when there is logged time.
  - Exercises `GoalCard`: the same for `{ lesson, exercise }`.
- **`ExerciseGroup`:** each exercise row gets a `StudyTimerButton` for `{ lesson, exercise }` and its logged time.
- **`CustomProjects`:** each project card gets a `StudyTimerButton` for `{ project }` and its logged time.

## 6. Study time view

- **Registration:**
  - New `AppView` value `'study-time'`.
  - `NAV_ITEMS` entry "Study time" with a lucide `Timer` icon, placed after Exercises.
  - Component `src/features/study-time/StudyTimeView.tsx`.
- **Header:** a `Banner` with a `.banner-study-time` theme (`--banner-tint`, `--banner-ink`, `--banner-shade`) and a decoration icon.
- **Page container:** uses `--sticky-top` padding like the other views.

### Sections

1. **`StudyStats`:**
   - Stat tiles: Today, This week, All time and Streak (for example "4 days").
   - A tile showing the category split as a stacked horizontal bar, with a legend and a duration for each category.
2. **`StudyDailyChart`:**
   - An inline SVG of the last 28 days, one stacked bar per day by category, with weekday and date labels.
   - A hover or focus tooltip shows the date, the total and each category. Bars are keyboard-focusable.
   - When there is no data, it shows an empty state.
3. **`StudyModuleBreakdown`:**
   - Rows per module ("Module 01 · Title") with theory, exercise and total columns and a proportional bar.
   - Each row expands to show its lessons.
   - Trailing groups: Personal projects, General study, and Lessons no longer in the roadmap (only when non-empty).
   - Modules with no logged time are listed collapsed with "—".
4. **`StudySessionLog`:**
   - **Filters:** range (Last 7 days, Last 30 days, All time), category (All, Theory, Exercise, Personal project, General), and module (only relevant to lesson sessions).
   - **Layout:** grouped by local day, newest first, with a day total in each group header.
   - **Rows:** start–finish time, duration, target label, category chip, note, and a "Paused ×N" hint when there is more than one interval. The active session appears first, marked "Running" or "Paused".
   - **Actions:** an **Add session** button opens the edit dialog in create mode, and clicking a row opens it in edit mode.

### `StudySessionDialog` (built on `Modal`)

- **Fields:** a `StudyTargetPicker`, a note textarea, and an intervals list with two `datetime-local` inputs per interval. An interval can be removed when there is more than one, and **Add interval** appends one.
- **Live total:** shown via `formatDuration`.
- **Validation:** `validateIntervals` messages are shown inline. Save is disabled while the form is invalid.
- **Active session:** the intervals are read-only, with the hint "Stop the timer to edit its times."
- **Create mode defaults:** one interval ending now and starting one hour earlier, with the target set to the suggested lesson's theory.
- **Delete session:** a destructive button confirmed with `window.confirm`, following existing usage.
- **Errors:** server errors appear in the dialog, and the dialog stays open.

## 7. Styling

- All new rules go in `src/styles.css`, placed next to related rules, with the cascade checked.
- The new view's scroll targets (if any) are added to the `scroll-margin-top` rule.
- Wording is in sentence case and UK English, and says "Exercises", not "Applied exercises".
- The mobile pill respects `env(safe-area-inset-bottom)` and sits above page content with a z-index below `Modal` and the navigation scrim.

## 8. Error handling

- **Load failure:** the tracker shows "Study timer unavailable" with the error. The rest of the app keeps working.
- **Failed timer action:** a brief inline error appears in the tracker. The state is left as the server last reported it.
- **Two tabs:** the server resolves conflicts because every action is applied server-side. A stale tab gets a 409 on pause/resume/stop, which triggers a reload of the sessions.
- **Dev-server restart:** a running session keeps its open interval in SQLite and carries on counting after a reload. Its duration includes the time the server was down, which is correct wall-clock study time.

## 9. Verification

There is no test suite. Verification means:

1. `npx tsc --noEmit -p tsconfig.app.json`, `npx tsc --noEmit -p tsconfig.node.json`, `npm run lint` and `npm run build` all pass.
2. The dev server is restarted (`server/` and `vite.config.ts` change) and the app is checked in the browser pane:
   - Start, pause, resume and stop from the sidebar card, the lesson panel, an exercise row and a project card.
   - Switching targets.
   - A reload while the timer is running.
   - Manual add, and editing intervals including validation errors.
   - Delete.
   - The dashboard figures match the logged sessions.
   - The mobile pill at 375px width.
   - The Database view lists both new tables.
3. Every test session is deleted individually through the UI afterwards. `data/roadmap.sqlite` is never reset, replaced or committed.
