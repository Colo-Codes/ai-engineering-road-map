# AI Engineering Roadmap

A local study app for moving from software engineering into AI engineering: 13 modules of lessons, reading lists, exercises and a resource library. It is a React + Vite + TypeScript front end backed by a local SQLite database that the Vite dev server exposes as a small JSON API.

## Commands

```bash
npm run dev            # Vite dev server on http://localhost:5173 (also serves /api/*)
npm run lint           # ESLint (typescript-eslint + react-hooks)
npm run build          # type-checks both tsconfigs, then vite build
npm run sync:roadmap   # rebuild data/roadmap.seed.sqlite from docs/ai-engineering-roadmap.md
```

- Type-check without building: `npx tsc --noEmit -p tsconfig.app.json` (client) and `npx tsc --noEmit -p tsconfig.node.json` (server, `vite.config.ts`, scripts).
- There is no test suite. Verify changes with type-check, lint, and by using the app in the browser.
- In the Claude desktop app, start the server with `preview_start` using the `dev` config in `.claude/launch.json`. Don't start it from Bash.
- Changes under `server/` or to `vite.config.ts` need a dev-server restart. Client code hot-reloads.

## How data flows

1. **Content** is authored in `docs/ai-engineering-roadmap.md`. Other files in `docs/` are reference notes and are not read by the app.
2. **`npm run sync:roadmap`** (`scripts/sync-roadmap-seed.mjs`) parses that Markdown into the committed seed database `data/roadmap.seed.sqlite`, and stores a `content_version` hash of `catalogueRevision` plus the Markdown.
3. **On server start**, `server/database.ts` copies the seed to `data/roadmap.sqlite` if it's missing. When the seed's `content_version` differs, it syncs the catalogue tables (phases, topics, sources, books, chapters) into it without touching saved state.
4. **`vite.config.ts`** mounts a plugin that serves the database at `/api/*` (`app-data`, `database`, and PUTs for `progress`, `exercise-checklist`, `book-settings`, `custom-projects`), plus `/api/open-file` to open local PDFs.
5. **`src/api.ts`** is the typed client. `src/hooks/useRoadmapData.ts` loads everything once, exposes the state and all mutations, and saves each changed slice back. The first value after loading is never re-saved.

Rules for this pipeline:

- **Never modify, reset or commit `data/roadmap.sqlite`.** It holds the user's real progress, exercise ticks, PDF paths and covers. If you toggle anything while testing in the browser, toggle it back individually. Never "clean up" with a reset.
- The parser matches Markdown field labels exactly (for example `Applied exercises:`, `Required reading:`). Don't rename them in the doc without updating the parser.
- When you change the parser or schema but not the Markdown, bump `catalogueRevision` in the sync script so existing databases resync.
- Schema changes go in `ensureCatalogSchema` in `server/database.ts`, as idempotent, guarded migrations (check `tableColumns` before `ALTER TABLE`).

## Front-end layout

```
src/
  App.tsx        shell: current view, selected lesson, navigation actions
  api.ts  catalog.ts  types.ts  styles.css
  lib/           pure helpers: format, progress, scroll, topics, library, covers, legacyState
  hooks/         useRoadmapData, useStuck, useScrollSpy, useEscapeKey
  components/    shared UI: Banner, SideRail, Sidebar, Modal, GoalCard, CompletionToggle, BookCover, ...
  features/      one folder per view: curriculum, exercises, library, database
```

- **Reuse before writing.** Check `components/`, `lib/` and `hooks/` first, and extend an existing piece rather than adding a near-copy. Examples:
  - labels: `pluralize`, `moduleLabel`, `lessonLabel` in `lib/format`
  - status rules: `lessonStatus`, `progressStatus` in `lib/progress`
  - scrolling: `scrollToTop`, `scrollToSection` in `lib/scroll`
  - dialogs: `Modal` (portal, Escape to close, locks page scroll)
- **Page headers** use `Banner`: a sticky, glassy card that shrinks and gains a shadow once content scrolls behind it. Give each page its own theme with a `className` that overrides `--banner-tint`, `--banner-ink` and `--banner-shade` (see `.banner-exercises`, `.banner-library`), plus a `decoration` icon.
- **Right-hand navigation** uses `SideRail`, `SideRailList` and `RailLink`, shared by the lesson list and the exercises module list. Theme it the same way via `--rail-*` variables.
- **Navigation** goes through `navigate` / `selectTopic` in `App.tsx`. They reset the scroll to the top, so don't add per-button scroll calls for view changes.
- **Sticky "stuck" detection** uses `useStuck` (a zero-height `.banner-sentinel` plus measuring on scroll), not IntersectionObserver, which misfired here.
- **Scroll targets below a banner** need their selector added to the `scroll-margin-top` rule that uses `--banner-height` in `styles.css`.

## Domain rules

- A lesson is complete only when both its learning outcomes are marked completed (`progress[id] === 'complete'`) and its exercise is ticked (`exerciseChecklist[id]`). Either one alone means "in progress". Module and roadmap percentages count complete lessons only.
- **UI wording:**
  - Say "Exercises", not "Applied exercises".
  - Completion toggles are labelled "Completed", never "Mark as completed".
  - Use sentence case and UK spelling.

## Styling

- All styles live in one plain-CSS file, `src/styles.css`. Rule order matters: later context rules deliberately override earlier ones, so keep that file whole and check the cascade when adding rules. No CSS framework.
- `--sticky-top` is set on `.main-content` per breakpoint. Page containers use it as their top padding so sticky headers rest where they stick.
- `lucide-react` provides the icons.

## Commits

Use Conventional Commits (`feat(scope): …`, `fix: …`, `build: …`, `docs: …`), grouped by layer: tooling → data/server → shared client code → features → app shell → docs. Never commit `node_modules/`, `dist/` or `data/roadmap.sqlite*`. The seed database `data/roadmap.seed.sqlite` is versioned on purpose.
