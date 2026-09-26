import { useMemo } from 'react'
import { Plus, Timer } from 'lucide-react'
import { Banner } from '../../components/Banner'
import type { StudyTracker } from '../../hooks/useStudyTracker'
import { useNow } from '../../hooks/useNow'
import { formatDuration, pluralize } from '../../lib/format'
import { dailyTotals, moduleBreakdown, STUDY_CATEGORIES, summaryStats } from '../../lib/studyTime'
import type { Phase } from '../../types'
import { StudyDailyChart } from './StudyDailyChart'
import { StudyModuleBreakdown } from './StudyModuleBreakdown'
import { StudySessionLog } from './StudySessionLog'
import { StudyStats } from './StudyStats'

const CHART_DAYS = 28

type StudyTimeViewProps = {
  tracker: StudyTracker
  phases: Phase[]
  onAddSession: () => void
  onEditSession: (sessionId: string) => void
}

export function StudyTimeView({ tracker, phases, onAddSession, onEditSession }: StudyTimeViewProps) {
  const { sessions } = tracker
  // Every second while a clock runs; otherwise once a minute, so "today" rolls over at midnight.
  const now = useNow(true, tracker.active?.status === 'running' ? 1000 : 60000)
  const summary = useMemo(() => summaryStats(sessions, now), [sessions, now])
  const days = useMemo(() => dailyTotals(sessions, CHART_DAYS, now), [sessions, now])
  const breakdown = useMemo(() => moduleBreakdown(sessions, phases, now), [sessions, phases, now])

  return (
    <section className="study-time-view">
      <Banner
        tag={pluralize(sessions.length, 'session')}
        stats={[`${formatDuration(summary.week)} this week`, `${formatDuration(summary.allTime)} in total`]}
        title="Study time"
        description="Theory and exercise time for every lesson, plus personal projects and general study. Start the timer from the sidebar, or add a session you forgot to time."
        className="banner-study-time"
        decoration={<Timer />}
        action={<button className="banner-action-button" onClick={onAddSession} disabled={!tracker.ready}><Plus size={18} />Add session</button>}
      />

      {tracker.loadError ? <div className="database-error" role="alert"><strong>Could not load study sessions</strong><span>{tracker.loadError}</span></div> : !tracker.ready ? <p className="study-empty">Loading study sessions…</p> : <>
        <StudyStats summary={summary} />

        <section className="study-section">
          <header className="study-section-heading">
            <h2>Last four weeks</h2>
            <ul className="study-legend">{STUDY_CATEGORIES.map(({ id, label }) => <li key={id} className={`study-accent-${id}`}><i className="study-dot" aria-hidden="true" />{label}</li>)}</ul>
          </header>
          <StudyDailyChart days={days} />
        </section>

        <StudySessionLog sessions={sessions} phases={phases} now={now} onEdit={onEditSession} />

        <section className="study-section">
          <header className="study-section-heading"><h2>By module</h2></header>
          <StudyModuleBreakdown groups={breakdown} />
        </section>
      </>}
    </section>
  )
}
