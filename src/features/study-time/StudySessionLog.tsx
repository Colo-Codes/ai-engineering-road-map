import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Pencil } from 'lucide-react'
import { formatDayHeading, formatDuration, formatTimeOfDay, moduleLabel, pluralize } from '../../lib/format'
import { CATEGORY_LABELS, dayKey, sessionDuration, sessionEnd, sessionStart, STUDY_CATEGORIES, studyCategory } from '../../lib/studyTime'
import type { Phase, StudyCategory, StudySession } from '../../types'

const DAY_MS = 24 * 60 * 60 * 1000
// The log shows this many sessions and scrolls for the rest.
const VISIBLE_ROWS = 4
const RANGES = [
  { id: '7', label: 'Last 7 days', days: 7 },
  { id: '30', label: 'Last 30 days', days: 30 },
  { id: 'all', label: 'All time', days: 0 },
]

type StudySessionLogProps = {
  sessions: StudySession[]
  phases: Phase[]
  now: number
  onEdit: (sessionId: string) => void
}

export function StudySessionLog({ sessions, phases, now, onEdit }: StudySessionLogProps) {
  const [rangeId, setRangeId] = useState('30')
  const [category, setCategory] = useState<StudyCategory | 'all'>('all')
  const [phaseId, setPhaseId] = useState('')
  const phaseByTopic = useMemo(() => new Map(phases.flatMap((phase) => phase.topics.map((topic) => [topic.id, phase]))), [phases])
  const moduleFilterApplies = category === 'all' || category === 'theory' || category === 'exercise'

  const days = useMemo(() => {
    const rangeDays = RANGES.find((range) => range.id === rangeId)?.days ?? 0
    const matches = sessions.filter((session) => {
      if (rangeDays && sessionStart(session).getTime() < now - rangeDays * DAY_MS) return false
      if (category !== 'all' && studyCategory(session.target) !== category) return false
      if (phaseId && moduleFilterApplies && (session.target.type !== 'lesson' || phaseByTopic.get(session.target.topicId)?.id !== phaseId)) return false
      return true
    })
    // The active session leads; the rest keep the server's newest-first order.
    matches.sort((a, b) => Number(a.status === 'finished') - Number(b.status === 'finished'))
    const byDay = new Map<string, { date: Date; sessions: StudySession[] }>()
    matches.forEach((session) => {
      const start = sessionStart(session)
      const entry = byDay.get(dayKey(start)) ?? { date: start, sessions: [] }
      entry.sessions.push(session)
      byDay.set(dayKey(start), entry)
    })
    return [...byDay.values()]
  }, [sessions, rangeId, category, phaseId, moduleFilterApplies, phaseByTopic, now])

  // Rows differ in height (notes, wrapping) and day headings sit between them, so the cap is measured
  // at the bottom of the last visible row rather than fixed in CSS.
  const scrollRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const list = scrollRef.current
    if (!list) return
    const fit = () => {
      const rows = list.querySelectorAll('.study-log-row')
      const lastVisible = rows[VISIBLE_ROWS - 1]
      list.style.maxHeight = rows.length > VISIBLE_ROWS && lastVisible
        ? `${lastVisible.getBoundingClientRect().bottom - list.getBoundingClientRect().top + list.scrollTop}px`
        : ''
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(list)
    return () => observer.disconnect()
  }, [days])

  return (
    <section className="study-section study-log">
      <header className="study-section-heading">
        <h2>Sessions</h2>
        <div className="study-log-filters">
          <select aria-label="Date range" value={rangeId} onChange={(event) => setRangeId(event.target.value)}>
            {RANGES.map((range) => <option key={range.id} value={range.id}>{range.label}</option>)}
          </select>
          <select aria-label="Category" value={category} onChange={(event) => setCategory(event.target.value as StudyCategory | 'all')}>
            <option value="all">All categories</option>
            {STUDY_CATEGORIES.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
          </select>
          <select aria-label="Module" value={phaseId} disabled={!moduleFilterApplies} onChange={(event) => setPhaseId(event.target.value)}>
            <option value="">All modules</option>
            {phases.map((phase) => <option key={phase.id} value={phase.id}>{moduleLabel(phase.number)} · {phase.title}</option>)}
          </select>
        </div>
      </header>

      {days.length ? <div className="study-log-scroll" ref={scrollRef}>{days.map(({ date, sessions: daySessions }) => (
        <div className="study-log-day" key={dayKey(date)}>
          <h3><span>{formatDayHeading(date)}</span><span>{formatDuration(daySessions.reduce((sum, session) => sum + sessionDuration(session, now), 0))}</span></h3>
          <ul>
            {daySessions.map((session) => {
              const sessionCategory = studyCategory(session.target)
              const end = sessionEnd(session)
              const breaks = session.intervals.length - 1
              const phase = session.target.type === 'lesson' ? phaseByTopic.get(session.target.topicId) : undefined
              return (
                <li key={session.id}>
                  <button type="button" className={`study-log-row study-accent-${sessionCategory}`} onClick={() => onEdit(session.id)} aria-label={`Edit session: ${session.target.label}, ${formatDuration(sessionDuration(session, now))}`}>
                    <span className="study-log-time">{formatTimeOfDay(sessionStart(session))} – {end ? formatTimeOfDay(end) : 'now'}</span>
                    <span className="study-log-target">
                      {phase && <small>{moduleLabel(phase.number)}</small>}
                      <strong>{session.target.label}</strong>
                      {session.note && <em>{session.note}</em>}
                    </span>
                    <span className="study-log-meta">
                      <span className="study-chip">{CATEGORY_LABELS[sessionCategory]}</span>
                      {session.status !== 'finished' && <span className="study-chip is-live">{session.status === 'running' ? 'Running' : 'Paused'}</span>}
                      {breaks > 0 && <small>{pluralize(breaks, 'break')}</small>}
                    </span>
                    <span className="study-log-duration">{formatDuration(sessionDuration(session, now))}</span>
                    <span className="study-log-edit" aria-hidden="true"><Pencil size={16} /></span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}</div> : <p className="study-empty">{sessions.length ? 'No sessions match these filters.' : 'No study sessions yet. Start the timer from the sidebar, or add a session you forgot to time.'}</p>}
    </section>
  )
}
