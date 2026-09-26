import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { StudyTracker } from '../hooks/useStudyTracker'
import { useNow } from '../hooks/useNow'
import { formatDuration, formatTimeOfDay } from '../lib/format'
import { fromDateTimeInput, intervalMs, isTargetComplete, lessonTarget, normaliseTarget, sessionDuration, toDateTimeInput, validateIntervals } from '../lib/studyTime'
import type { CustomProject, Phase, StudyInterval, StudySession, StudyTarget, Topic } from '../types'
import { Modal } from './Modal'
import { StudyTargetPicker } from './StudyTargetPicker'

// One row of the interval editor. `original` keeps the recorded times, which are more precise than the inputs.
type IntervalDraft = { start: string; end: string; original?: StudyInterval }

const HOUR_MS = 60 * 60 * 1000

function draftsFor(session: StudySession | null): IntervalDraft[] {
  if (session) return session.intervals.map((interval) => ({ start: toDateTimeInput(interval.startedAt), end: interval.endedAt ? toDateTimeInput(interval.endedAt) : '', original: interval }))
  const end = new Date()
  return [{ start: toDateTimeInput(new Date(end.getTime() - HOUR_MS).toISOString()), end: toDateTimeInput(end.toISOString()) }]
}

// A field left untouched keeps its exact recorded time instead of the minute shown in the input.
function toInterval({ start, end, original }: IntervalDraft): StudyInterval {
  return {
    startedAt: original && start === toDateTimeInput(original.startedAt) ? original.startedAt : fromDateTimeInput(start),
    endedAt: original?.endedAt && end === toDateTimeInput(original.endedAt) ? original.endedAt : fromDateTimeInput(end),
  }
}

type StudySessionDialogProps = {
  // Null to add a session by hand.
  session: StudySession | null
  tracker: StudyTracker
  phases: Phase[]
  projects: CustomProject[]
  suggestedTopic: Topic
  onClose: () => void
}

export function StudySessionDialog({ session, tracker, phases, projects, suggestedTopic, onClose }: StudySessionDialogProps) {
  const headingId = useId()
  const isActive = Boolean(session && session.status !== 'finished')
  const now = useNow(true, isActive ? 1000 : 15000)
  const [target, setTarget] = useState<StudyTarget>(() => session?.target ?? lessonTarget(suggestedTopic, 'theory'))
  const [note, setNote] = useState(session?.note ?? '')
  const [drafts, setDrafts] = useState(() => draftsFor(session))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const intervals = session && isActive ? session.intervals : drafts.map(toInterval)
  const problem = isActive ? null : validateIntervals(intervals, now)
  const total = session && isActive ? sessionDuration(session, now) : intervals.reduce((sum, interval) => sum + intervalMs(interval, now), 0)
  const canSave = !saving && !problem && isTargetComplete(target)

  const updateDraft = (index: number, change: Partial<IntervalDraft>) => setDrafts((current) => current.map((draft, position) => position === index ? { ...draft, ...change } : draft))
  const addInterval = () => setDrafts((current) => [...current, { start: current[current.length - 1]?.end ?? '', end: '' }])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSave) return
    setSaving(true)
    setError('')
    const input = { target: normaliseTarget(target), note, intervals }
    try {
      if (session) await tracker.update(session.id, input)
      else await tracker.create(input)
      onClose()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The session could not be saved.')
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!session || !window.confirm(`Delete this study session (${formatDuration(sessionDuration(session, now))})? This cannot be undone.`)) return
    try {
      await tracker.remove(session.id)
      onClose()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The session could not be deleted.')
    }
  }

  return (
    <Modal className="study-dialog study-session-dialog" labelledBy={headingId} closeLabel="Close" onClose={onClose}>
      <form onSubmit={(event) => void save(event)}>
        <header className="study-dialog-header">
          <span className="detail-label">{session ? 'Study session' : 'New study session'}</span>
          <h2 id={headingId}>{session ? 'Edit session' : 'Add a session'}</h2>
        </header>

        <fieldset className="study-dialog-section">
          <legend>What you studied</legend>
          <StudyTargetPicker value={target} phases={phases} projects={projects} fallbackTopic={suggestedTopic} onChange={setTarget} />
        </fieldset>

        <fieldset className="study-dialog-section">
          <legend>Times</legend>
          {session && isActive ? <>
            <ol className="study-interval-list is-readonly">
              {session.intervals.map((interval) => <li key={interval.startedAt}>{formatTimeOfDay(new Date(interval.startedAt))} – {interval.endedAt ? formatTimeOfDay(new Date(interval.endedAt)) : 'now'}</li>)}
            </ol>
            <p className="study-picker-hint">Stop the timer to edit its times.</p>
          </> : <>
            <ol className="study-interval-list">
              {drafts.map((draft, index) => (
                <li key={index}>
                  <label><span>Start</span><input type="datetime-local" value={draft.start} required onChange={(event) => updateDraft(index, { start: event.target.value })} /></label>
                  <label><span>Finish</span><input type="datetime-local" value={draft.end} required onChange={(event) => updateDraft(index, { end: event.target.value })} /></label>
                  {drafts.length > 1 && <button type="button" className="study-interval-remove" aria-label={`Remove interval ${index + 1}`} onClick={() => setDrafts((current) => current.filter((_, position) => position !== index))}><Trash2 size={15} /></button>}
                </li>
              ))}
            </ol>
            <button type="button" className="study-add-interval" onClick={addInterval}><Plus size={15} />Add interval</button>
          </>}
          <p className="study-dialog-total">Total <strong>{problem ? '—' : formatDuration(total)}</strong></p>
          {problem && <p className="study-dialog-problem" role="alert">{problem}</p>}
        </fieldset>

        <label className="study-note-field">
          <span>Note <em>optional</em></span>
          <textarea value={note} rows={3} maxLength={2000} placeholder="What did you cover?" onChange={(event) => setNote(event.target.value)} />
        </label>

        {error && <p className="study-dialog-problem" role="alert">{error}</p>}

        <footer className="study-dialog-actions">
          {session && <button type="button" className="study-delete-button" onClick={() => void remove()}><Trash2 size={15} />Delete session</button>}
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="study-save-button" disabled={!canSave}>{session ? 'Save changes' : 'Add session'}</button>
        </footer>
      </form>
    </Modal>
  )
}
