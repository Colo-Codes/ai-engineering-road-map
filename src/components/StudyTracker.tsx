import { useId, useState } from 'react'
import { Check, Ellipsis, Pause, Play, Square, Timer } from 'lucide-react'
import type { StudyTracker as StudyTrackerState } from '../hooks/useStudyTracker'
import { useNow } from '../hooks/useNow'
import { formatClock, formatDuration, lessonLabel } from '../lib/format'
import { CATEGORY_LABELS, isTargetComplete, lessonTarget, normaliseTarget, sessionDuration, studyCategory } from '../lib/studyTime'
import type { CustomProject, Phase, RoadmapTopic, StudyTarget } from '../types'
import { Modal } from './Modal'
import { StudyTargetPicker } from './StudyTargetPicker'

type StudyTrackerProps = {
  // "card" sits in the sidebar footer; "pill" floats at the bottom of narrow screens, where the sidebar is hidden.
  variant: 'card' | 'pill'
  tracker: StudyTrackerState
  phases: Phase[]
  projects: CustomProject[]
  // The lesson on screen (or last on screen): what the idle tracker offers to time.
  suggestedTopic: RoadmapTopic
  onEditSession: (sessionId: string) => void
}

export function StudyTracker({ variant, tracker, phases, projects, suggestedTopic, onEditSession }: StudyTrackerProps) {
  const headingId = useId()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [picking, setPicking] = useState(false)

  const openPicker = () => { setSheetOpen(false); setPicking(true) }
  const editStopped = (sessionId: string) => { setSheetOpen(false); tracker.dismissStopped(); onEditSession(sessionId) }
  const panel = (compact: boolean) => <StudyTrackerPanel headingId={headingId} compact={compact} tracker={tracker} phases={phases} suggestedTopic={suggestedTopic} onPickTarget={openPicker} onEditStopped={editStopped} />

  return (
    <>
      {variant === 'card' ? panel(true) : <StudyPill tracker={tracker} onOpen={() => setSheetOpen(true)} onEditStopped={editStopped} />}
      {sheetOpen && <Modal className="study-dialog study-sheet" labelledBy={headingId} closeLabel="Close study timer" onClose={() => setSheetOpen(false)}>{panel(false)}</Modal>}
      {picking && <StudyTargetDialog phases={phases} projects={projects} suggestedTopic={suggestedTopic} onStart={(target) => { tracker.start(target); setPicking(false) }} onClose={() => setPicking(false)} />}
    </>
  )
}

type StudyTrackerPanelProps = {
  headingId: string
  // The sidebar card packs everything into one or two rows so the module list keeps its height;
  // the mobile sheet has room for the full layout.
  compact: boolean
  tracker: StudyTrackerState
  phases: Phase[]
  suggestedTopic: RoadmapTopic
  onPickTarget: () => void
  onEditStopped: (sessionId: string) => void
}

function StudyTrackerPanel({ headingId, compact, tracker, phases, suggestedTopic, onPickTarget, onEditStopped }: StudyTrackerPanelProps) {
  const { active, stopped } = tracker
  const running = active?.status === 'running'
  const now = useNow(running)
  const category = active ? studyCategory(active.target) : null
  const suggestedIndex = phases.find((phase) => phase.id === suggestedTopic.phaseId)?.topics.findIndex((topic) => topic.id === suggestedTopic.id) ?? 0
  const suggestedLabel = `${lessonLabel(Math.max(0, suggestedIndex))} · ${suggestedTopic.title}`
  const paused = active?.status === 'paused' && <span className="study-chip">Paused</span>

  const pickButton = compact
    ? <button type="button" className="study-tracker-more" disabled={!tracker.ready} onClick={onPickTarget} aria-label="Time something else" title="Time something else"><Ellipsis size={16} /></button>
    : <button type="button" className="study-tracker-change" disabled={!tracker.ready} onClick={onPickTarget}>Time something else</button>
  const liveControls = <>
    <span className="study-tracker-clock study-clock" role="timer">{active && formatClock(sessionDuration(active, now))}</span>
    <div className="study-tracker-buttons">
      {running
        ? <button type="button" onClick={tracker.pause} aria-label="Pause timer" title="Pause"><Pause size={17} /></button>
        : <button type="button" onClick={tracker.resume} aria-label="Resume timer" title="Resume"><Play size={17} /></button>}
      <button type="button" className="study-tracker-stop" onClick={tracker.stop} aria-label="Stop timer" title="Stop"><Square size={15} /></button>
      {compact && pickButton}
    </div>
  </>
  const startControls = <div className="study-tracker-start">
    <button type="button" className="study-accent-theory" disabled={!tracker.ready} onClick={() => tracker.start(lessonTarget(suggestedTopic, 'theory'))} aria-label={`Start timing ${suggestedTopic.title} theory`} title={`Time theory: ${suggestedLabel}`}><Play size={14} />Theory</button>
    <button type="button" className="study-accent-exercise" disabled={!tracker.ready} onClick={() => tracker.start(lessonTarget(suggestedTopic, 'exercise'))} aria-label={`Start timing ${suggestedTopic.title} exercise`} title={`Time exercise: ${suggestedLabel}`}><Play size={14} />Exercise</button>
    {compact && pickButton}
  </div>

  return (
    <section className={`study-tracker ${compact ? 'is-compact ' : ''}${active ? `is-${active.status} study-accent-${category}` : 'is-idle'}`} aria-labelledby={headingId}>
      {compact
        ? <h2 id={headingId} className="visually-hidden">Study timer</h2>
        : <header className="study-tracker-head"><h2 id={headingId}><Timer size={15} />Study timer</h2>{paused}</header>}

      {tracker.loadError ? <p className="study-tracker-error" role="alert">Study timer unavailable. {tracker.loadError}</p> : <>
        {active && category ? <>
          {compact
            ? <p className="study-tracker-target" title={`${CATEGORY_LABELS[category]}: ${active.target.label}`}><i className="study-dot" aria-hidden="true" /><strong>{active.target.label}</strong>{paused}</p>
            : <p className="study-tracker-target"><small>{CATEGORY_LABELS[category]}</small><strong>{active.target.label}</strong></p>}
          <div className="study-tracker-live">{liveControls}</div>
        </> : <>
          {compact
            ? <div className="study-tracker-row"><Timer size={16} className="study-tracker-icon" aria-hidden="true" />{startControls}</div>
            : <><p className="study-tracker-target"><small>{lessonLabel(Math.max(0, suggestedIndex))}</small><strong>{suggestedTopic.title}</strong></p>{startControls}</>}
        </>}
        {stopped && <p className="study-tracker-notice" role="status"><Check size={14} />Logged {formatDuration(sessionDuration(stopped, now))}<span aria-hidden="true">·</span><button type="button" onClick={() => onEditStopped(stopped.id)}>Add note</button></p>}
        {tracker.error && <p className="study-tracker-error" role="alert">{tracker.error}</p>}
        {!compact && pickButton}
      </>}
    </section>
  )
}

function StudyPill({ tracker, onOpen, onEditStopped }: { tracker: StudyTrackerState; onOpen: () => void; onEditStopped: (sessionId: string) => void }) {
  const { active, stopped } = tracker
  const running = active?.status === 'running'
  const now = useNow(running)
  if (tracker.loadError) return null

  if (!active) {
    return (
      <div className="study-pill">
        {stopped
          ? <button type="button" className="study-pill-open" onClick={() => onEditStopped(stopped.id)}><Check size={16} />Logged {formatDuration(sessionDuration(stopped, now))} · Add note</button>
          : <button type="button" className="study-pill-open" onClick={onOpen}><Timer size={16} />Start timer</button>}
      </div>
    )
  }

  return (
    <div className={`study-pill is-${active.status} study-accent-${studyCategory(active.target)}`}>
      <button type="button" className="study-pill-open" onClick={onOpen} aria-label={`Open study timer: ${active.target.label}`}>
        <i className="study-dot" aria-hidden="true" /><span className="study-clock">{formatClock(sessionDuration(active, now))}</span>
      </button>
      {running
        ? <button type="button" onClick={tracker.pause} aria-label="Pause timer"><Pause size={16} /></button>
        : <button type="button" onClick={tracker.resume} aria-label="Resume timer"><Play size={16} /></button>}
      <button type="button" onClick={tracker.stop} aria-label="Stop timer"><Square size={14} /></button>
    </div>
  )
}

type StudyTargetDialogProps = {
  phases: Phase[]
  projects: CustomProject[]
  suggestedTopic: RoadmapTopic
  onStart: (target: StudyTarget) => void
  onClose: () => void
}

function StudyTargetDialog({ phases, projects, suggestedTopic, onStart, onClose }: StudyTargetDialogProps) {
  const headingId = useId()
  const [target, setTarget] = useState<StudyTarget>(() => lessonTarget(suggestedTopic, 'theory'))

  return (
    <Modal className="study-dialog" labelledBy={headingId} closeLabel="Close" onClose={onClose}>
      <form onSubmit={(event) => { event.preventDefault(); if (isTargetComplete(target)) onStart(normaliseTarget(target)) }}>
        <header className="study-dialog-header"><span className="detail-label">Study timer</span><h2 id={headingId}>What are you studying?</h2></header>
        <StudyTargetPicker value={target} phases={phases} projects={projects} fallbackTopic={suggestedTopic} onChange={setTarget} />
        <footer className="study-dialog-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="study-save-button" disabled={!isTargetComplete(target)}><Play size={15} />Start timer</button>
        </footer>
      </form>
    </Modal>
  )
}
