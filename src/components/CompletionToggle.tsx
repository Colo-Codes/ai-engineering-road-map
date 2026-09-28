import { nextStatus, STATUS_LABELS } from '../lib/progress'
import type { TopicStatus } from '../types'
import { StatusIcon } from './StatusIcon'

// Shows the current state; each click moves it on (not started → in progress → completed → not started).
export function CompletionToggle({ status, subject, onToggle }: { status: TopicStatus; subject: string; onToggle: () => void }) {
  return (
    <button type="button" className={`goal-card-toggle is-${status}`} aria-label={`${subject}: ${STATUS_LABELS[status]}. Select to change to ${STATUS_LABELS[nextStatus(status)]}.`} onClick={onToggle}>
      <StatusIcon status={status} size={status === 'complete' ? 15 : 16} />{STATUS_LABELS[status]}
    </button>
  )
}
