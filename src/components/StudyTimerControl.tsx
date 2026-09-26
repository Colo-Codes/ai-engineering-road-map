import { Clock, Pause, Play, Timer } from 'lucide-react'
import type { StudyTracker } from '../hooks/useStudyTracker'
import { useNow } from '../hooks/useNow'
import { formatClock, formatDuration } from '../lib/format'
import { CATEGORY_LABELS, isSameTarget, openIntervalMs, sessionDuration, studyCategory, targetKey } from '../lib/studyTime'
import type { StudyTarget } from '../types'

// A start button for one lesson, exercise or project, which becomes the live clock while that target is timed.
export function StudyTimerControl({ target, tracker }: { target: StudyTarget; tracker: StudyTracker }) {
  const { active } = tracker
  const current = active && isSameTarget(active.target, target) ? active : null
  const running = current?.status === 'running'
  const now = useNow(running)
  const category = studyCategory(target)
  const logged = (tracker.logged[targetKey(target)] ?? 0) + (current && running ? openIntervalMs(current, now) : 0)
  const subject = `${target.label} (${CATEGORY_LABELS[category].toLowerCase()})`

  return (
    <div className={`study-timer-control study-accent-${category}`}>
      {current
        ? <button type="button" className={`study-timer-button is-${current.status}`} onClick={running ? tracker.pause : tracker.resume} aria-label={`${running ? 'Pause' : 'Resume'} timing ${subject}`}>
          {running ? <Pause size={14} /> : <Play size={14} />}{running ? 'Timing' : 'Paused'}<span className="study-clock">{formatClock(sessionDuration(current, now))}</span>
        </button>
        : <button type="button" className="study-timer-button" disabled={!tracker.ready} onClick={() => tracker.start(target)} aria-label={`Start timing ${subject}`}>
          <Timer size={14} />Start timer
        </button>}
      {logged > 0 && <span className="study-time-logged"><Clock size={13} />{formatDuration(logged)} logged</span>}
    </div>
  )
}
