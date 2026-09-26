import { formatDuration, pluralize } from '../../lib/format'
import { STUDY_CATEGORIES } from '../../lib/studyTime'
import type { StudySummary } from '../../lib/studyTime'

export function StudyStats({ summary }: { summary: StudySummary }) {
  const tiles = [
    { label: 'Today', value: formatDuration(summary.today), detail: 'Since midnight' },
    { label: 'This week', value: formatDuration(summary.week), detail: 'Since Monday' },
    { label: 'All time', value: formatDuration(summary.allTime), detail: 'Every logged session' },
    { label: 'Streak', value: pluralize(summary.streak, 'day'), detail: summary.streak ? 'In a row with study time' : 'Log time today to start one' },
  ]
  const categories = STUDY_CATEGORIES.filter(({ id }) => summary.byCategory[id] > 0)

  return (
    <div className="study-stats">
      {tiles.map(({ label, value, detail }) => <div className="study-stat" key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>)}
      <div className="study-stat study-split">
        <span>Where the time went</span>
        {categories.length ? <>
          <div className="study-split-bar" aria-hidden="true">
            {categories.map(({ id }) => <i key={id} className={`study-accent-${id}`} style={{ flexGrow: summary.byCategory[id] }} />)}
          </div>
          <ul className="study-legend">
            {categories.map(({ id, label }) => <li key={id} className={`study-accent-${id}`}><i className="study-dot" aria-hidden="true" />{label}<strong>{formatDuration(summary.byCategory[id])}</strong></li>)}
          </ul>
        </> : <small>Nothing logged yet.</small>}
      </div>
    </div>
  )
}
