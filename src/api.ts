import type { LegacyState } from './lib/legacyState'
import type { AppData, CustomProject, DatabaseAdminData, ExerciseChecklist, OpenStatus, ProgressMap, StudySession, StudySessionInput, StudyTimerAction } from './types'

export type BookSettings = { bookPaths: Record<string, string>; bookCovers: Record<string, string> }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init)
  const isJson = response.headers.get('Content-Type')?.includes('application/json')
  const result = isJson ? await response.json() as T & { error?: string } : null
  if (!response.ok) throw new Error(result?.error || 'The local database request failed.')
  return result as T
}

function json(method: 'POST' | 'PUT', body: unknown): RequestInit {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
}

// Each saver serialises its own writes so a slow request can never land after a newer one.
function createSaver<T>(path: string, toBody: (value: T) => unknown) {
  let queue = Promise.resolve<unknown>(undefined)
  return (value: T) => {
    const result = queue.catch(() => undefined).then(() => request<{ saved: true }>(path, json('PUT', toBody(value))))
    queue = result
    return result
  }
}

export const saveProgress = createSaver<ProgressMap>('/api/progress', (progress) => ({ progress }))
export const saveExerciseChecklist = createSaver<ExerciseChecklist>('/api/exercise-checklist', (exerciseChecklist) => ({ exerciseChecklist }))
export const saveBookSettings = createSaver<BookSettings>('/api/book-settings', (settings) => settings)
export const saveCustomProjects = createSaver<CustomProject[]>('/api/custom-projects', (customProjects) => ({ customProjects }))

export function loadAppData() {
  return request<AppData>('/api/app-data')
}

export function loadDatabaseAdmin() {
  return request<DatabaseAdminData>('/api/database')
}

export function importLegacyState(payload: LegacyState) {
  return request<{ imported: boolean }>('/api/import-legacy', json('POST', payload))
}

// Every study request answers with the full, fresh session list.
type StudySessions = { sessions: StudySession[] }

export function loadStudySessions() {
  return request<StudySessions>('/api/study-sessions')
}

export function studyTimerAction(action: StudyTimerAction) {
  return request<StudySessions>('/api/study-timer', json('POST', action))
}

export function createStudySession(input: StudySessionInput) {
  return request<StudySessions>('/api/study-sessions', json('POST', input))
}

export function updateStudySession(id: string, input: StudySessionInput) {
  return request<StudySessions>(`/api/study-sessions/${encodeURIComponent(id)}`, json('PUT', input))
}

export function deleteStudySession(id: string) {
  return request<StudySessions>(`/api/study-sessions/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

async function requestOpenPdf(path: string) {
  const response = await fetch('/api/open-file', json('POST', { path }))
  if (!response.headers.get('Content-Type')?.includes('application/json')) {
    throw new Error('PDF opening is available when the app runs locally with Vite.')
  }
  const result = await response.json() as { error?: string }
  if (!response.ok) throw new Error(result.error || 'The PDF could not be opened.')
}

export async function openPdf(path: string): Promise<OpenStatus> {
  try {
    await requestOpenPdf(path)
    return { tone: 'success', message: 'Opened in your system PDF app.' }
  } catch (error) {
    return { tone: 'error', message: error instanceof Error ? error.message : 'The PDF could not be opened.' }
  }
}
