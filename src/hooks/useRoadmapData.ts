import { useEffect, useMemo, useRef, useState } from 'react'
import { importLegacyState, loadAppData, saveBookSettings, saveCustomProjects, saveExerciseChecklist, saveProgress, saveResourceNotes } from '../api'
import { clearLegacyState, readLegacyState } from '../lib/legacyState'
import { hasResourceNote } from '../lib/library'
import { toggleChecklistEntry } from '../lib/progress'
import type { CompletionState } from '../lib/progress'
import type { Book, BookLibrary, BuildStatus, CustomProject, ExerciseChecklist, Phase, ProgressMap, ResourceNote, ResourceNotes, RoadmapTopic } from '../types'

function useSaveOnChange<T>(enabled: boolean, value: T, save: (value: T) => Promise<unknown>) {
  const lastSaved = useRef<{ value: T } | null>(null)
  useEffect(() => {
    if (!enabled || lastSaved.current?.value === value) return
    // The first value after loading is what the server already holds; only later changes need writing.
    const isLoadedValue = lastSaved.current === null
    lastSaved.current = { value }
    if (!isLoadedValue) void save(value).catch(console.error)
  }, [enabled, value, save])
}

export function useRoadmapData() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [progress, setProgress] = useState<ProgressMap>({})
  const [exerciseChecklist, setExerciseChecklist] = useState<ExerciseChecklist>({})
  const [bookPaths, setBookPaths] = useState<Record<string, string>>({})
  const [bookCovers, setBookCovers] = useState<Record<string, string>>({})
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([])
  const [resourceNotes, setResourceNotes] = useState<ResourceNotes>({})
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const hydrate = async () => {
      try {
        const legacy = readLegacyState()
        if (legacy) {
          await importLegacyState(legacy)
          clearLegacyState()
        }
        const data = await loadAppData()
        if (cancelled) return
        setPhases(data.phases)
        setBooks(data.books)
        setProgress(data.progress)
        setExerciseChecklist(data.exerciseChecklist)
        setBookPaths(data.bookPaths)
        setBookCovers(data.bookCovers)
        setCustomProjects(data.customProjects)
        setResourceNotes(data.resourceNotes)
        setReady(true)
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'The roadmap database could not be loaded.')
      }
    }
    void hydrate()
    return () => { cancelled = true }
  }, [])

  const bookSettings = useMemo(() => ({ bookPaths, bookCovers }), [bookPaths, bookCovers])
  useSaveOnChange(ready, progress, saveProgress)
  useSaveOnChange(ready, exerciseChecklist, saveExerciseChecklist)
  useSaveOnChange(ready, bookSettings, saveBookSettings)
  useSaveOnChange(ready, customProjects, saveCustomProjects)
  useSaveOnChange(ready, resourceNotes, saveResourceNotes)

  const allTopics = useMemo<RoadmapTopic[]>(
    () => phases.flatMap((phase) => phase.topics.map((topic) => ({ ...topic, phaseId: phase.id }))),
    [phases],
  )
  const completion = useMemo<CompletionState>(() => ({ progress, exerciseChecklist }), [progress, exerciseChecklist])
  const library = useMemo<BookLibrary>(() => ({ books, paths: bookPaths, covers: bookCovers, notes: resourceNotes }), [books, bookPaths, bookCovers, resourceNotes])

  return {
    ready,
    error,
    phases,
    allTopics,
    completion,
    library,
    customProjects,
    toggleReading: (topicId: string) => setProgress((current) => ({ ...current, [topicId]: current[topicId] === 'complete' ? 'not-started' : 'complete' })),
    toggleExercise: (topicId: string) => setExerciseChecklist((current) => toggleChecklistEntry(current, topicId)),
    resetProgress: () => {
      setProgress({})
      setExerciseChecklist({})
    },
    setBookPath: (bookId: string, path: string) => setBookPaths((current) => ({ ...current, [bookId]: path })),
    setBookCover: (bookId: string, cover: string) => setBookCovers((current) => ({ ...current, [bookId]: cover })),
    // An emptied note is removed rather than stored blank.
    setResourceNote: (key: string, note: ResourceNote) => setResourceNotes((current) => {
      const next = { ...current }
      if (hasResourceNote(note)) next[key] = note
      else delete next[key]
      return next
    }),
    addCustomProject: (project: CustomProject) => setCustomProjects((current) => [...current, project]),
    removeCustomProject: (projectId: string) => setCustomProjects((current) => current.filter((project) => project.id !== projectId)),
    setCustomProjectStatus: (projectId: string, status: BuildStatus) => setCustomProjects((current) => current.map((project) => project.id === projectId ? { ...project, status } : project)),
  }
}
