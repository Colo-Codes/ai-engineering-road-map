export type TopicStatus = 'not-started' | 'in-progress' | 'complete'
export type ProgressMap = Record<string, TopicStatus>
export type ExerciseChecklist = Record<string, boolean>
export type BuildStatus = 'to-build' | 'in-progress' | 'built'
export type TopicSourceType = 'core' | 'supporting' | 'official' | 'optional'
export type TopicSource = { type: TopicSourceType; content: string }

export type Topic = {
  id: string
  title: string
  description?: string
  learningGoal?: string
  appliedExercises?: string
  readingNote?: string
  isExtension?: boolean
  sources?: TopicSource[]
  primary: string
  secondary: string
}

export type RoadmapTopic = Topic & { phaseId: string }

export type Phase = {
  id: string
  number: number
  title: string
  goal: string
  learningGoal?: string
  buildingGoal?: string
  outcome: string
  accent: string
  topics: Topic[]
}

export type Milestone = { label: string; title: string; phaseId: string; note: string }

export type Book = {
  id: string
  shortTitle: string
  title: string
  authors: string
  summary: string
  color: string
  referenceUrl?: string
  isOptional?: boolean
  aliases: string[]
  chapters: Record<string, string>
}

export type BookReference = { book: Book; locator: string }
export type CustomProject = { id: string; title: string; note: string; status: BuildStatus }
export type OpenStatus = { tone: 'working' | 'success' | 'error'; message: string }
export type BookLibrary = { books: Book[]; paths: Record<string, string>; covers: Record<string, string> }
export type AppView = 'curriculum' | 'exercises' | 'library' | 'database'

export type AppData = {
  phases: Phase[]
  milestones: Milestone[]
  books: Book[]
  progress: ProgressMap
  exerciseChecklist: ExerciseChecklist
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
