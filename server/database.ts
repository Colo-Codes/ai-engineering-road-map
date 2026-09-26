import Database from 'better-sqlite3'
import { randomUUID } from 'node:crypto'
import { copyFileSync, existsSync } from 'node:fs'

export type TopicStatus = 'not-started' | 'in-progress' | 'complete'
export type BuildStatus = 'to-build' | 'in-progress' | 'built'
export type ProgressMap = Record<string, TopicStatus>
export type ExerciseChecklist = Record<string, boolean>
export type CustomProject = { id: string; title: string; note: string; status: BuildStatus }
export type StudyKind = 'theory' | 'exercise'
export type StudyTarget =
  | { type: 'lesson'; topicId: string; kind: StudyKind; label: string }
  | { type: 'project'; projectId: string; label: string }
  | { type: 'general'; label: string }
export type StudyStatus = 'running' | 'paused' | 'finished'
export type StudyInterval = { startedAt: string; endedAt: string | null }
export type StudySession = { id: string; target: StudyTarget; note: string; status: StudyStatus; createdAt: string; intervals: StudyInterval[] }
export type StudySessionInput = { target: StudyTarget; note: string; intervals: StudyInterval[] }
export type StudyTimerAction = { action: 'start'; target: StudyTarget } | { action: 'pause' | 'resume' | 'stop' }
type TopicSourceType = 'core' | 'supporting' | 'official' | 'optional'
type TopicSource = { type: TopicSourceType; content: string }
type Topic = {
  id: string
  title: string
  description: string
  learningGoal: string
  appliedExercises: string
  readingNote: string
  isExtension: boolean
  sources: TopicSource[]
  primary: string
  secondary: string
}
type Phase = {
  id: string
  number: number
  title: string
  goal: string
  learningGoal: string
  buildingGoal: string
  outcome: string
  accent: string
  topics: Topic[]
}
type Milestone = { label: string; title: string; phaseId: string; note: string }
type Book = {
  id: string
  shortTitle: string
  title: string
  authors: string
  summary: string
  color: string
  referenceUrl: string
  isOptional: boolean
  aliases: string[]
  chapters: Record<string, string>
}

type PhaseRow = {
  id: string
  number: number
  title: string
  goal: string
  learning_goal: string
  building_goal: string
  outcome: string
  accent: string
  sort_order: number
}
type TopicRow = {
  id: string
  phase_id: string
  title: string
  primary_source: string
  secondary_source: string
  description: string
  learning_goal: string
  applied_exercises: string
  reading_note: string
  is_extension: number
  sort_order: number
}
type MilestoneRow = { label: string; title: string; phase_id: string; note: string }
type BookRow = Omit<Book, 'shortTitle' | 'referenceUrl' | 'isOptional' | 'aliases' | 'chapters'> & {
  short_title: string
  reference_url: string
  is_optional: number
  sort_order: number
}
type AliasRow = { book_id: string; alias: string }
type ChapterRow = { book_id: string; chapter_key: string; title: string }
type TopicSourceRow = { topic_id: string; source_type: TopicSourceType; content: string }
type ProgressRow = { topic_id: string; status: TopicStatus }
type ExerciseChecklistRow = { topic_id: string }
type BookSettingRow = { book_id: string; pdf_path: string; cover_data: string }
type ProjectRow = CustomProject & { sort_order: number }
type StudySessionRow = {
  id: string
  target_type: StudyTarget['type']
  topic_id: string | null
  kind: StudyKind | null
  project_id: string | null
  target_label: string
  note: string
  status: StudyStatus
  created_at: string
}
type StudyIntervalRow = { id: number; session_id: string; started_at: string; ended_at: string | null }

// A study request the client got wrong (400), pointed at a missing session (404) or made against stale timer state (409).
export class StudyRequestError extends Error {
  constructor(message: string, readonly status: 400 | 404 | 409) {
    super(message)
  }
}

// Allows for the browser clock running slightly ahead of the server's.
const FUTURE_TOLERANCE_MS = 5000

export type LegacyState = {
  progress: ProgressMap
  bookPaths: Record<string, string>
  bookCovers: Record<string, string>
  customProjects: CustomProject[]
}

export type DatabaseAdminTable = {
  name: string
  label: string
  description: string
  columns: string[]
  rows: Array<Record<string, string | number | null>>
}

export type DatabaseAdminData = {
  databaseFile: string
  tables: DatabaseAdminTable[]
}

type DatabaseAppData = LegacyState & { phases: Phase[]; milestones: Milestone[]; books: Book[]; exerciseChecklist: ExerciseChecklist }

export type RoadmapDatabase = {
  getAppData: () => DatabaseAppData
  getAdminData: () => DatabaseAdminData
  replaceProgress: (progress: ProgressMap) => void
  replaceExerciseChecklist: (checklist: ExerciseChecklist) => void
  replaceBookSettings: (bookPaths: Record<string, string>, bookCovers: Record<string, string>) => void
  replaceCustomProjects: (projects: CustomProject[]) => void
  listStudySessions: () => StudySession[]
  applyStudyTimerAction: (action: StudyTimerAction) => void
  createStudySession: (input: StudySessionInput) => void
  updateStudySession: (id: string, input: StudySessionInput) => void
  deleteStudySession: (id: string) => void
  importLegacyState: (state: LegacyState) => boolean
  close: () => void
}

function tableColumns(database: Database.Database, table: string): Set<string> {
  return new Set((database.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>).map((column) => column.name))
}

function addColumn(database: Database.Database, table: string, name: string, definition: string): void {
  if (!tableColumns(database, table).has(name)) database.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`)
}

function ensureCatalogSchema(database: Database.Database): void {
  addColumn(database, 'phases', 'learning_goal', "TEXT NOT NULL DEFAULT ''")
  addColumn(database, 'phases', 'building_goal', "TEXT NOT NULL DEFAULT ''")
  addColumn(database, 'topics', 'description', "TEXT NOT NULL DEFAULT ''")
  addColumn(database, 'topics', 'learning_goal', "TEXT NOT NULL DEFAULT ''")
  addColumn(database, 'topics', 'reading_note', "TEXT NOT NULL DEFAULT ''")
  addColumn(database, 'topics', 'is_extension', 'INTEGER NOT NULL DEFAULT 0 CHECK (is_extension IN (0, 1))')
  addColumn(database, 'books', 'reference_url', "TEXT NOT NULL DEFAULT ''")
  addColumn(database, 'books', 'is_optional', 'INTEGER NOT NULL DEFAULT 0 CHECK (is_optional IN (0, 1))')
  if (!tableColumns(database, 'topics').has('applied_exercises')) {
    if (tableColumns(database, 'topics').has('building_goal')) database.exec('ALTER TABLE topics RENAME COLUMN building_goal TO applied_exercises')
    else addColumn(database, 'topics', 'applied_exercises', "TEXT NOT NULL DEFAULT ''")
  }
  if (tableColumns(database, 'topics').has('practice')) database.exec('ALTER TABLE topics DROP COLUMN practice')
  if (tableColumns(database, 'phases').has('eyebrow')) database.exec('ALTER TABLE phases DROP COLUMN eyebrow')
  database.exec(`
    CREATE TABLE IF NOT EXISTS topic_sources (
      id INTEGER PRIMARY KEY,
      topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
      source_type TEXT NOT NULL CHECK (source_type IN ('core', 'supporting', 'official', 'optional')),
      content TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      UNIQUE (topic_id, source_type, sort_order)
    );
    CREATE TABLE IF NOT EXISTS catalog_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS exercise_checklist (
      topic_id TEXT PRIMARY KEY REFERENCES topics(id) ON DELETE CASCADE,
      checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    -- No foreign keys to topics or custom_projects: catalogue syncs and project saves delete those rows,
    -- and logged time must outlive them. target_label keeps the history readable.
    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL CHECK (target_type IN ('lesson', 'project', 'general')),
      topic_id TEXT,
      kind TEXT CHECK (kind IN ('theory', 'exercise')),
      project_id TEXT,
      target_label TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL CHECK (status IN ('running', 'paused', 'finished')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS study_intervals (
      id INTEGER PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
      started_at TEXT NOT NULL,
      ended_at TEXT
    );
    CREATE INDEX IF NOT EXISTS study_intervals_session ON study_intervals (session_id, started_at);
  `)
}

function catalogVersion(database: Database.Database): string {
  const row = database.prepare("SELECT value FROM catalog_metadata WHERE key = 'content_version'").get() as { value: string } | undefined
  return row?.value ?? ''
}

function syncCatalogFromSeed(database: Database.Database, seedPath: string): void {
  const seed = new Database(seedPath, { readonly: true })
  const seedVersion = catalogVersion(seed)
  if (!seedVersion || catalogVersion(database) === seedVersion) {
    seed.close()
    return
  }

  const tables = ['phases', 'topics', 'topic_sources', 'milestones', 'books', 'book_aliases', 'book_chapters', 'catalog_metadata'] as const
  const rows = Object.fromEntries(tables.map((table) => [table, seed.prepare(`SELECT * FROM ${table}`).all()])) as Record<typeof tables[number], Array<Record<string, unknown>>>
  seed.close()

  const sync = database.transaction(() => {
    database.prepare('DELETE FROM topic_sources').run()
    database.prepare('DELETE FROM book_aliases').run()
    database.prepare('DELETE FROM book_chapters').run()
    database.prepare('DELETE FROM milestones').run()
    database.prepare('UPDATE topics SET sort_order = sort_order + 100').run()

    const upsertRows = (table: string, tableRows: Array<Record<string, unknown>>, conflictColumns: string[]) => {
      if (!tableRows.length) return
      const columns = Object.keys(tableRows[0])
      const updates = columns.filter((column) => !conflictColumns.includes(column)).map((column) => `${column}=excluded.${column}`)
      const statement = database.prepare(`
        INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map((column) => `@${column}`).join(', ')})
        ON CONFLICT(${conflictColumns.join(', ')}) DO UPDATE SET ${updates.join(', ')}
      `)
      tableRows.forEach((row) => statement.run(row))
    }

    upsertRows('phases', rows.phases, ['id'])
    upsertRows('topics', rows.topics, ['id'])

    const activeTopicIds = rows.topics.map((row) => row.id as string)
    const placeholders = activeTopicIds.map(() => '?').join(', ')
    database.prepare(`DELETE FROM topics WHERE id NOT IN (${placeholders})`).run(...activeTopicIds)

    upsertRows('books', rows.books, ['id'])

    const insertRows = (table: string, tableRows: Array<Record<string, unknown>>) => {
      if (!tableRows.length) return
      const columns = Object.keys(tableRows[0])
      const statement = database.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map((column) => `@${column}`).join(', ')})`)
      tableRows.forEach((row) => statement.run(row))
    }

    insertRows('topic_sources', rows.topic_sources)
    insertRows('milestones', rows.milestones)
    insertRows('book_aliases', rows.book_aliases)
    insertRows('book_chapters', rows.book_chapters)
    upsertRows('catalog_metadata', rows.catalog_metadata, ['key'])
    database.pragma('user_version = 4')
  })

  sync()
}

export function createRoadmapDatabase(path: string, seedPath: string): RoadmapDatabase {
  if (!existsSync(path)) {
    if (!existsSync(seedPath)) throw new Error(`The roadmap seed database at ${seedPath} is missing.`)
    copyFileSync(seedPath, path)
  }

  const database = new Database(path)
  database.pragma('foreign_keys = ON')
  database.pragma('journal_mode = WAL')

  const schemaExists = database.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'phases'").get()
  if (!schemaExists) throw new Error(`The roadmap database at ${path} has not been seeded.`)
  ensureCatalogSchema(database)
  syncCatalogFromSeed(database, seedPath)

  const getAppData = (): DatabaseAppData => {
    const phaseRows = database.prepare('SELECT * FROM phases ORDER BY sort_order').all() as PhaseRow[]
    const topicRows = database.prepare('SELECT * FROM topics ORDER BY phase_id, sort_order').all() as TopicRow[]
    const topicSourceRows = database.prepare('SELECT topic_id, source_type, content FROM topic_sources ORDER BY topic_id, sort_order').all() as TopicSourceRow[]
    const phases = phaseRows.map((row) => ({
      id: row.id,
      number: row.number,
      title: row.title,
      goal: row.goal,
      learningGoal: row.learning_goal,
      buildingGoal: row.building_goal,
      outcome: row.outcome,
      accent: row.accent,
      topics: topicRows.filter((topic) => topic.phase_id === row.id).map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        learningGoal: topic.learning_goal,
        appliedExercises: topic.applied_exercises,
        readingNote: topic.reading_note,
        isExtension: topic.is_extension === 1,
        sources: topicSourceRows.filter((source) => source.topic_id === topic.id).map((source) => ({
          type: source.source_type,
          content: source.content,
        })),
        primary: topic.primary_source,
        secondary: topic.secondary_source,
      })),
    }))

    const milestones = (database.prepare('SELECT label, title, phase_id, note FROM milestones ORDER BY sort_order').all() as MilestoneRow[])
      .map((row): Milestone => ({ label: row.label, title: row.title, phaseId: row.phase_id, note: row.note }))

    const aliasRows = database.prepare('SELECT book_id, alias FROM book_aliases ORDER BY book_id, sort_order').all() as AliasRow[]
    const chapterRows = database.prepare('SELECT book_id, chapter_key, title FROM book_chapters ORDER BY book_id, sort_order').all() as ChapterRow[]
    const books = (database.prepare('SELECT * FROM books ORDER BY sort_order').all() as BookRow[]).map((row): Book => ({
      id: row.id,
      shortTitle: row.short_title,
      title: row.title,
      authors: row.authors,
      summary: row.summary,
      color: row.color,
      referenceUrl: row.reference_url,
      isOptional: row.is_optional === 1,
      aliases: aliasRows.filter((alias) => alias.book_id === row.id).map((alias) => alias.alias),
      chapters: Object.fromEntries(chapterRows.filter((chapter) => chapter.book_id === row.id).map((chapter) => [chapter.chapter_key, chapter.title])),
    }))

    const progress = Object.fromEntries((database.prepare('SELECT topic_id, status FROM topic_progress').all() as ProgressRow[])
      .map((row) => [row.topic_id, row.status])) as ProgressMap
    const exerciseChecklist = Object.fromEntries((database.prepare('SELECT topic_id FROM exercise_checklist').all() as ExerciseChecklistRow[])
      .map((row) => [row.topic_id, true])) as ExerciseChecklist
    const settings = database.prepare('SELECT book_id, pdf_path, cover_data FROM book_settings').all() as BookSettingRow[]
    const bookPaths = Object.fromEntries(settings.filter((row) => row.pdf_path).map((row) => [row.book_id, row.pdf_path]))
    const bookCovers = Object.fromEntries(settings.filter((row) => row.cover_data).map((row) => [row.book_id, row.cover_data]))
    const customProjects = (database.prepare('SELECT id, title, note, status, sort_order FROM custom_projects ORDER BY sort_order').all() as ProjectRow[])
      .map(({ id, title, note, status }) => ({ id, title, note, status }))

    return { phases, milestones, books, progress, exerciseChecklist, bookPaths, bookCovers, customProjects }
  }

  const adminTableDefinitions = [
    { name: 'phases', label: 'Modules', description: 'The roadmap modules and their learning outcomes.' },
    { name: 'topics', label: 'Lessons', description: 'Each lesson and its learning outcomes and exercises.' },
    { name: 'topic_sources', label: 'Lesson sources', description: 'Required, recommended, technical and further sources for each lesson.' },
    { name: 'milestones', label: 'Milestones', description: 'Required practical assessments attached to modules.' },
    { name: 'books', label: 'Books', description: 'The books referenced throughout the roadmap.' },
    { name: 'book_aliases', label: 'Book aliases', description: 'Short names used to match lesson references to books.' },
    { name: 'book_chapters', label: 'Book chapters', description: 'Chapter names used by lesson references.' },
    { name: 'topic_progress', label: 'Progress', description: 'Saved in-progress and completed lesson states.' },
    { name: 'exercise_checklist', label: 'Exercise checklist', description: 'Exercises checked off on the Exercises page.' },
    { name: 'book_settings', label: 'Book settings', description: 'Local PDF paths and custom cover settings.' },
    { name: 'custom_projects', label: 'Custom projects', description: 'Personal projects added to the build board.' },
    { name: 'study_sessions', label: 'Study sessions', description: 'Timed study sessions and what they were for.' },
    { name: 'study_intervals', label: 'Study intervals', description: 'The active periods within each study session.' },
    { name: 'catalog_metadata', label: 'Catalogue metadata', description: 'The schema and source-document versions used by this catalogue.' },
  ] as const

  const getAdminData = (): DatabaseAdminData => ({
    databaseFile: 'data/roadmap.sqlite',
    tables: adminTableDefinitions.map(({ name, label, description }) => {
      const columns = (database.prepare(`PRAGMA table_info(${name})`).all() as Array<{ name: string }>).map((column) => column.name)
      const rawRows = database.prepare(`SELECT * FROM ${name}`).all() as Array<Record<string, unknown>>
      const rows = rawRows.map((row) => Object.fromEntries(Object.entries(row).map(([column, value]) => {
        if (typeof value === 'string' && value.startsWith('data:image/')) {
          return [column, `[stored image · ${Math.max(1, Math.round(value.length / 1024))} KB]`]
        }
        if (Buffer.isBuffer(value)) return [column, `[binary data · ${value.length} bytes]`]
        return [column, value as string | number | null]
      })))
      return { name, label, description, columns, rows }
    }),
  })

  const replaceProgress = database.transaction((progress: ProgressMap) => {
    database.prepare('DELETE FROM topic_progress').run()
    const insert = database.prepare('INSERT INTO topic_progress (topic_id, status) VALUES (?, ?)')
    Object.entries(progress).forEach(([topicId, status]) => {
      if (status === 'in-progress' || status === 'complete') insert.run(topicId, status)
    })
  })

  const replaceExerciseChecklist = database.transaction((checklist: ExerciseChecklist) => {
    database.prepare('DELETE FROM exercise_checklist').run()
    const insert = database.prepare('INSERT INTO exercise_checklist (topic_id) VALUES (?)')
    Object.entries(checklist).forEach(([topicId, checked]) => {
      if (checked) insert.run(topicId)
    })
  })

  const replaceBookSettings = database.transaction((bookPaths: Record<string, string>, bookCovers: Record<string, string>) => {
    database.prepare('DELETE FROM book_settings').run()
    const insert = database.prepare('INSERT INTO book_settings (book_id, pdf_path, cover_data) VALUES (?, ?, ?)')
    const ids = new Set([...Object.keys(bookPaths), ...Object.keys(bookCovers)])
    ids.forEach((bookId) => {
      const pdfPath = typeof bookPaths[bookId] === 'string' ? bookPaths[bookId] : ''
      const coverData = typeof bookCovers[bookId] === 'string' ? bookCovers[bookId] : ''
      if (pdfPath || coverData) insert.run(bookId, pdfPath, coverData)
    })
  })

  const replaceCustomProjects = database.transaction((projects: CustomProject[]) => {
    database.prepare('DELETE FROM custom_projects').run()
    const insert = database.prepare('INSERT INTO custom_projects (id, title, note, status, sort_order) VALUES (?, ?, ?, ?, ?)')
    projects.forEach((project, index) => insert.run(project.id, project.title, project.note, project.status, index))
  })

  const studyTargetColumns = (target: StudyTarget) => ({
    target_type: target.type,
    topic_id: target.type === 'lesson' ? target.topicId : null,
    kind: target.type === 'lesson' ? target.kind : null,
    project_id: target.type === 'project' ? target.projectId : null,
    target_label: target.label.trim() || 'General study',
  })

  const toStudyTarget = (row: StudySessionRow): StudyTarget => {
    if (row.target_type === 'lesson') return { type: 'lesson', topicId: row.topic_id ?? '', kind: row.kind ?? 'theory', label: row.target_label }
    if (row.target_type === 'project') return { type: 'project', projectId: row.project_id ?? '', label: row.target_label }
    return { type: 'general', label: row.target_label }
  }

  const listStudySessions = (): StudySession[] => {
    const intervalsBySession = new Map<string, StudyInterval[]>()
    const intervalRows = database.prepare('SELECT session_id, started_at, ended_at FROM study_intervals ORDER BY session_id, started_at').all() as StudyIntervalRow[]
    intervalRows.forEach((row) => {
      const intervals = intervalsBySession.get(row.session_id) ?? []
      intervals.push({ startedAt: row.started_at, endedAt: row.ended_at })
      intervalsBySession.set(row.session_id, intervals)
    })
    const sessions = (database.prepare('SELECT * FROM study_sessions').all() as StudySessionRow[]).map((row): StudySession => ({
      id: row.id,
      target: toStudyTarget(row),
      note: row.note,
      status: row.status,
      createdAt: row.created_at,
      intervals: intervalsBySession.get(row.id) ?? [],
    }))
    const startOf = (session: StudySession) => session.intervals[0]?.startedAt ?? session.createdAt
    return sessions.sort((a, b) => startOf(b).localeCompare(startOf(a)))
  }

  // Parses, sorts and checks closed intervals; every timestamp comes back as an ISO string in UTC.
  const normaliseIntervals = (intervals: StudyInterval[], now: number): StudyInterval[] => {
    if (!intervals.length) throw new StudyRequestError('A session needs at least one interval.', 400)
    const parsed = intervals.map(({ startedAt, endedAt }) => {
      const start = Date.parse(startedAt)
      const end = endedAt === null ? Number.NaN : Date.parse(endedAt)
      if (Number.isNaN(start) || Number.isNaN(end)) throw new StudyRequestError('Every interval needs a valid start and finish time.', 400)
      if (end <= start) throw new StudyRequestError('Each interval must end after it starts.', 400)
      if (end > now + FUTURE_TOLERANCE_MS) throw new StudyRequestError('Intervals cannot end in the future.', 400)
      return { start, end }
    }).sort((a, b) => a.start - b.start)
    parsed.forEach(({ start }, index) => {
      if (index && start < parsed[index - 1].end) throw new StudyRequestError('Intervals cannot overlap.', 400)
    })
    return parsed.map(({ start, end }) => ({ startedAt: new Date(start).toISOString(), endedAt: new Date(end).toISOString() }))
  }

  const insertStudySession = (id: string, target: StudyTarget, note: string, status: StudyStatus, createdAt: string) => {
    database.prepare(`
      INSERT INTO study_sessions (id, target_type, topic_id, kind, project_id, target_label, note, status, created_at)
      VALUES (@id, @target_type, @topic_id, @kind, @project_id, @target_label, @note, @status, @created_at)
    `).run({ id, ...studyTargetColumns(target), note: note.trim(), status, created_at: createdAt })
  }

  const insertStudyInterval = (sessionId: string, startedAt: string, endedAt: string | null) => {
    database.prepare('INSERT INTO study_intervals (session_id, started_at, ended_at) VALUES (?, ?, ?)').run(sessionId, startedAt, endedAt)
  }

  const setStudyStatus = (sessionId: string, status: StudyStatus) => {
    database.prepare('UPDATE study_sessions SET status = ? WHERE id = ?').run(status, sessionId)
  }

  // Closes the open interval at `now`, dropping it if it would have no length. Returns how many intervals remain.
  const closeOpenInterval = (sessionId: string, now: string): number => {
    const open = database.prepare('SELECT id, started_at FROM study_intervals WHERE session_id = ? AND ended_at IS NULL').get(sessionId) as Pick<StudyIntervalRow, 'id' | 'started_at'> | undefined
    if (open && open.started_at < now) database.prepare('UPDATE study_intervals SET ended_at = ? WHERE id = ?').run(now, open.id)
    else if (open) database.prepare('DELETE FROM study_intervals WHERE id = ?').run(open.id)
    return (database.prepare('SELECT COUNT(*) AS count FROM study_intervals WHERE session_id = ?').get(sessionId) as { count: number }).count
  }

  const deleteStudySessionRow = (sessionId: string) => database.prepare('DELETE FROM study_sessions WHERE id = ?').run(sessionId).changes

  const finishStudySession = (sessionId: string, now: string) => {
    if (closeOpenInterval(sessionId, now)) setStudyStatus(sessionId, 'finished')
    else deleteStudySessionRow(sessionId)
  }

  // Timer actions use the server's clock, so every tab agrees and only one session is ever active.
  const applyStudyTimerAction = database.transaction((request: StudyTimerAction) => {
    const now = new Date().toISOString()
    const active = database.prepare("SELECT * FROM study_sessions WHERE status != 'finished' ORDER BY created_at DESC").all() as StudySessionRow[]
    const session = active[0]

    if (request.action === 'start') {
      active.forEach(({ id }) => finishStudySession(id, now))
      const id = randomUUID()
      insertStudySession(id, request.target, '', 'running', now)
      insertStudyInterval(id, now, null)
    } else if (request.action === 'pause') {
      if (session?.status !== 'running') throw new StudyRequestError('No study session is running.', 409)
      if (closeOpenInterval(session.id, now)) setStudyStatus(session.id, 'paused')
      else deleteStudySessionRow(session.id)
    } else if (request.action === 'resume') {
      if (session?.status !== 'paused') throw new StudyRequestError('No study session is paused.', 409)
      insertStudyInterval(session.id, now, null)
      setStudyStatus(session.id, 'running')
    } else {
      if (!session) throw new StudyRequestError('No study session is active.', 409)
      finishStudySession(session.id, now)
    }
  })

  const createStudySession = database.transaction((input: StudySessionInput) => {
    const intervals = normaliseIntervals(input.intervals, Date.now())
    const id = randomUUID()
    insertStudySession(id, input.target, input.note, 'finished', new Date().toISOString())
    intervals.forEach((interval) => insertStudyInterval(id, interval.startedAt, interval.endedAt))
  })

  const updateStudySession = database.transaction((id: string, input: StudySessionInput) => {
    const session = database.prepare('SELECT status FROM study_sessions WHERE id = ?').get(id) as Pick<StudySessionRow, 'status'> | undefined
    if (!session) throw new StudyRequestError('That study session no longer exists.', 404)
    // The active session's times belong to the timer until it is stopped.
    const intervals = session.status === 'finished' ? normaliseIntervals(input.intervals, Date.now()) : null
    database.prepare(`
      UPDATE study_sessions SET target_type = @target_type, topic_id = @topic_id, kind = @kind, project_id = @project_id, target_label = @target_label, note = @note
      WHERE id = @id
    `).run({ id, ...studyTargetColumns(input.target), note: input.note.trim() })
    if (!intervals) return
    database.prepare('DELETE FROM study_intervals WHERE session_id = ?').run(id)
    intervals.forEach((interval) => insertStudyInterval(id, interval.startedAt, interval.endedAt))
  })

  const deleteStudySession = (id: string) => {
    if (!deleteStudySessionRow(id)) throw new StudyRequestError('That study session no longer exists.', 404)
  }

  const importLegacyState = database.transaction((state: LegacyState) => {
    let imported = false
    if ((database.prepare('SELECT COUNT(*) AS count FROM topic_progress').get() as { count: number }).count === 0 && Object.keys(state.progress).length) {
      replaceProgress(state.progress)
      imported = true
    }
    if ((database.prepare('SELECT COUNT(*) AS count FROM book_settings').get() as { count: number }).count === 0 && (Object.keys(state.bookPaths).length || Object.keys(state.bookCovers).length)) {
      replaceBookSettings(state.bookPaths, state.bookCovers)
      imported = true
    }
    if ((database.prepare('SELECT COUNT(*) AS count FROM custom_projects').get() as { count: number }).count === 0 && state.customProjects.length) {
      replaceCustomProjects(state.customProjects)
      imported = true
    }
    return imported
  })

  return {
    getAppData,
    getAdminData,
    replaceProgress,
    replaceExerciseChecklist,
    replaceBookSettings,
    replaceCustomProjects,
    listStudySessions,
    applyStudyTimerAction,
    createStudySession,
    updateStudySession,
    deleteStudySession,
    importLegacyState,
    close: () => database.close(),
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function isStudyTarget(value: unknown): value is StudyTarget {
  if (!isRecord(value) || typeof value.label !== 'string' || value.label.length > 300) return false
  if (value.type === 'lesson') return isNonEmptyString(value.topicId) && (value.kind === 'theory' || value.kind === 'exercise') && isNonEmptyString(value.label)
  if (value.type === 'project') return isNonEmptyString(value.projectId) && isNonEmptyString(value.label)
  return value.type === 'general'
}

export function isStudySessionInput(value: unknown): value is StudySessionInput {
  return isRecord(value) && isStudyTarget(value.target) && typeof value.note === 'string' && value.note.length <= 5000
    && Array.isArray(value.intervals) && value.intervals.length <= 500
    && value.intervals.every((interval) => isRecord(interval) && typeof interval.startedAt === 'string' && (typeof interval.endedAt === 'string' || interval.endedAt === null))
}

export function isStudyTimerAction(value: unknown): value is StudyTimerAction {
  if (!isRecord(value)) return false
  if (value.action === 'start') return isStudyTarget(value.target)
  return value.action === 'pause' || value.action === 'resume' || value.action === 'stop'
}

export function isTopicStatus(value: unknown): value is TopicStatus {
  return value === 'not-started' || value === 'in-progress' || value === 'complete'
}

export function isBuildStatus(value: unknown): value is BuildStatus {
  return value === 'to-build' || value === 'in-progress' || value === 'built'
}
