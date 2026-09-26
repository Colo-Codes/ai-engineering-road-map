import { useCallback, useEffect, useMemo, useState } from 'react'
import { createStudySession, deleteStudySession, loadStudySessions, studyTimerAction, updateStudySession } from '../api'
import { loggedByTarget } from '../lib/studyTime'
import type { StudySession, StudySessionInput, StudyTarget, StudyTimerAction } from '../types'

const NOTICE_MS = 6000

// Study sessions are row-based, so unlike useRoadmapData each change is its own request,
// and the server's answer (the full session list) replaces local state.
export function useStudyTracker() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  // The session the last Stop finished, briefly offered for a note.
  const [stoppedId, setStoppedId] = useState('')

  useEffect(() => {
    let cancelled = false
    loadStudySessions()
      .then((result) => {
        if (cancelled) return
        setSessions(result.sessions)
        setReady(true)
      })
      .catch((cause: unknown) => {
        if (!cancelled) setLoadError(cause instanceof Error ? cause.message : 'Study sessions could not be loaded.')
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!stoppedId) return
    const timer = window.setTimeout(() => setStoppedId(''), NOTICE_MS)
    return () => window.clearTimeout(timer)
  }, [stoppedId])

  const active = sessions.find((session) => session.status !== 'finished') ?? null
  const logged = useMemo(() => loggedByTarget(sessions), [sessions])

  const runTimer = useCallback(async (action: StudyTimerAction) => {
    try {
      const result = await studyTimerAction(action)
      setSessions(result.sessions)
      setError('')
      return result.sessions
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The timer could not be updated.')
      // Another tab may have changed the timer; show what the server holds now.
      void loadStudySessions().then((result) => setSessions(result.sessions)).catch(() => undefined)
      return null
    }
  }, [])

  const start = useCallback((target: StudyTarget) => {
    setStoppedId('')
    void runTimer({ action: 'start', target })
  }, [runTimer])
  const pause = useCallback(() => { void runTimer({ action: 'pause' }) }, [runTimer])
  const resume = useCallback(() => { void runTimer({ action: 'resume' }) }, [runTimer])
  const stop = useCallback(async () => {
    const stoppingId = active?.id
    const result = await runTimer({ action: 'stop' })
    if (result && stoppingId && result.some((session) => session.id === stoppingId)) setStoppedId(stoppingId)
  }, [active?.id, runTimer])

  // Dialog operations reject on failure so the dialog can stay open and show why.
  const create = useCallback(async (input: StudySessionInput) => setSessions((await createStudySession(input)).sessions), [])
  const update = useCallback(async (id: string, input: StudySessionInput) => setSessions((await updateStudySession(id, input)).sessions), [])
  const remove = useCallback(async (id: string) => setSessions((await deleteStudySession(id)).sessions), [])

  return {
    ready,
    loadError,
    error,
    sessions,
    active,
    logged,
    stopped: sessions.find((session) => session.id === stoppedId) ?? null,
    dismissStopped: () => setStoppedId(''),
    start,
    pause,
    resume,
    stop: () => { void stop() },
    create,
    update,
    remove,
  }
}

export type StudyTracker = ReturnType<typeof useStudyTracker>
