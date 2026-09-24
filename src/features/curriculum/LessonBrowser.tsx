import { RailLink, SideRail, SideRailList } from '../../components/SideRail'
import { lessonLabel } from '../../lib/format'
import { lessonStatus } from '../../lib/progress'
import type { CompletionState } from '../../lib/progress'
import type { Phase, TopicStatus } from '../../types'

export type StatusFilter = 'all' | TopicStatus

const FILTER_OPTIONS: Array<[StatusFilter, string]> = [['all', 'All statuses'], ['not-started', 'Not started'], ['in-progress', 'In progress'], ['complete', 'Complete']]

type LessonBrowserProps = {
  phase: Phase
  selectedId: string
  completion: CompletionState
  filter: StatusFilter
  onFilterChange: (filter: StatusFilter) => void
  onSelectTopic: (topicId: string) => void
}

export function LessonBrowser({ phase, selectedId, completion, filter, onFilterChange, onSelectTopic }: LessonBrowserProps) {
  const lessons = phase.topics
    .map((topic, index) => ({ topic, index, status: lessonStatus(topic.id, completion) }))
    .filter(({ status }) => filter === 'all' || status === filter)

  return (
    <SideRail title="In this module" count={lessons.length} label="Lesson navigation">
      <div className="filter-bar"><select className="status-select" aria-label="Filter by status" value={filter} onChange={(event) => onFilterChange(event.target.value as StatusFilter)}>{FILTER_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <SideRailList label="Module lessons" selectedKey={selectedId}>
        {lessons.map(({ topic, index, status }) => (
          <RailLink
            key={topic.id}
            title={topic.title}
            meta={<>{lessonLabel(index)}{topic.isExtension && <em>Extension</em>}</>}
            status={status}
            selected={topic.id === selectedId}
            onClick={() => onSelectTopic(topic.id)}
          />
        ))}
      </SideRailList>
      {!lessons.length && <div className="empty-state"><p>No lessons have this status.</p><button onClick={() => onFilterChange('all')}>Clear filter</button></div>}
      <div className="study-note"><span>Indicative study allocation</span><p>One part reading.<br />Two parts practical work.</p><div className="study-ratio"><i /><i /><i /></div></div>
    </SideRail>
  )
}
