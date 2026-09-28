import { useId, useState } from 'react'
import type { StudyTracker } from '../hooks/useStudyTracker'
import { useIdlePrompt } from '../hooks/useIdlePrompt'
import { formatDuration, formatTimeOfDay } from '../lib/format'
import { dayKey } from '../lib/studyTime'
import { Modal } from './Modal'

// After five minutes without keyboard or mouse input, offers to take that stretch back out of the running timer.
export function IdlePrompt({ tracker }: { tracker: StudyTracker }) {
  const headingId = useId()
  const [busy, setBusy] = useState(false)
  const running = tracker.active?.status === 'running' ? tracker.active : null
  const { away, keep, clear } = useIdlePrompt(running?.id ?? null)
  if (!away || !running) return null

  const from = new Date(away.from)
  const to = new Date(away.to)
  const awayFor = formatDuration(to.getTime() - from.getTime())
  // An away period that crosses midnight names the day it started.
  const fromLabel = dayKey(from) === dayKey(to) ? formatTimeOfDay(from) : `${from.toLocaleDateString('en-GB', { weekday: 'short' })} ${formatTimeOfDay(from)}`

  const discard = async (stop: boolean) => {
    setBusy(true)
    const done = await tracker.discardIdle(away, stop)
    setBusy(false)
    if (done) clear()
  }

  return (
    <Modal className="study-dialog idle-prompt" labelledBy={headingId} closeLabel="Keep and continue" onClose={keep}>
      <header className="study-dialog-header">
        <span className="detail-label">Study timer</span>
        <h2 id={headingId}>Were you still studying?</h2>
      </header>
      <p className="idle-prompt-copy">
        There was no keyboard or mouse activity from <strong>{fromLabel}</strong> to <strong>{formatTimeOfDay(to)}</strong> ({awayFor}) while timing <strong>{running.target.label}</strong>.
      </p>
      {tracker.error && <p className="study-dialog-problem" role="alert">{tracker.error}</p>}
      <footer className="study-dialog-actions">
        <button type="button" disabled={busy} onClick={() => void discard(true)}>Discard and stop</button>
        <button type="button" disabled={busy} onClick={keep}>Keep and continue</button>
        <button type="button" className="study-save-button" disabled={busy} onClick={() => void discard(false)}>Discard {awayFor}</button>
      </footer>
    </Modal>
  )
}
