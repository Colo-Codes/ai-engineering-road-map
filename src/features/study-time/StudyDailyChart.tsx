import { formatDayHeading, formatDuration } from '../../lib/format'
import { STUDY_CATEGORIES } from '../../lib/studyTime'
import type { DayTotals } from '../../lib/studyTime'

const HALF_HOUR_MS = 30 * 60 * 1000

function axisLabel(date: Date, isToday: boolean) {
  if (isToday) return 'Today'
  return date.getDay() === 1 ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''
}

export function StudyDailyChart({ days }: { days: DayTotals[] }) {
  const max = Math.max(0, ...days.map((day) => day.total))
  if (!max) return <p className="study-empty">No time logged in the last four weeks.</p>
  // Rounded up to a whole half hour so the scale reads cleanly.
  const scale = Math.ceil(max / HALF_HOUR_MS) * HALF_HOUR_MS

  return (
    <div className="study-chart">
      <div className="study-chart-scale" aria-hidden="true"><span>{formatDuration(scale)}</span><span>{formatDuration(scale / 2)}</span><span>0</span></div>
      <ol className="study-chart-bars">
        {days.map((day, index) => {
          const isToday = index === days.length - 1
          const align = index < 4 ? 'align-start' : index > days.length - 5 ? 'align-end' : ''
          const categories = STUDY_CATEGORIES.filter(({ id }) => day.byCategory[id] > 0)
          return (
            <li key={day.day} className={isToday ? 'is-today' : ''}>
              <div className={`study-chart-bar ${align}`} tabIndex={0} role="img" aria-label={`${formatDayHeading(day.date)}: ${day.total ? formatDuration(day.total) : 'nothing logged'}`}>
                {day.total > 0 && <span className="study-chart-stack" style={{ height: `${day.total / scale * 100}%` }}>
                  {categories.map(({ id }) => <i key={id} className={`study-accent-${id}`} style={{ flexGrow: day.byCategory[id] }} />)}
                </span>}
                <span className="study-chart-tooltip" aria-hidden="true">
                  <strong>{formatDayHeading(day.date)}</strong>
                  <span>{day.total ? formatDuration(day.total) : 'Nothing logged'}</span>
                  {categories.map(({ id, label }) => <span key={id} className={`study-accent-${id}`}><i className="study-dot" />{label}<b>{formatDuration(day.byCategory[id])}</b></span>)}
                </span>
              </div>
              <span className="study-chart-label">{axisLabel(day.date, isToday)}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
