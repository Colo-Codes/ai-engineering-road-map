import type { AppData, CustomProject, ProgressMap } from '../types'

// Browser-storage keys used before app state moved into the local SQLite database.
const LEGACY_KEYS = {
  progress: 'ai-engineering-roadmap-progress-v1',
  bookPaths: 'ai-engineering-roadmap-book-paths-v1',
  bookCovers: 'ai-engineering-roadmap-book-covers-v1',
  customProjects: 'ai-engineering-roadmap-custom-projects-v1',
} as const

export type LegacyState = Pick<AppData, 'progress' | 'bookPaths' | 'bookCovers' | 'customProjects'>

function readValue<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? '') as T }
  catch { return fallback }
}

export function readLegacyState(): LegacyState | null {
  if (!Object.values(LEGACY_KEYS).some((key) => localStorage.getItem(key) !== null)) return null
  return {
    progress: readValue<ProgressMap>(LEGACY_KEYS.progress, {}),
    bookPaths: readValue<Record<string, string>>(LEGACY_KEYS.bookPaths, {}),
    bookCovers: readValue<Record<string, string>>(LEGACY_KEYS.bookCovers, {}),
    customProjects: readValue<CustomProject[]>(LEGACY_KEYS.customProjects, []),
  }
}

export function clearLegacyState() {
  Object.values(LEGACY_KEYS).forEach((key) => localStorage.removeItem(key))
}
