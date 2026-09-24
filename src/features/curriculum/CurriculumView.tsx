import type { Phase } from '../../types'
import { LessonBrowser } from './LessonBrowser'
import type { StatusFilter } from './LessonBrowser'
import { LessonPanel } from './LessonPanel'
import type { LessonPanelProps } from './LessonPanel'
import { ModuleBanner } from './ModuleBanner'

type CurriculumViewProps = LessonPanelProps & { phase: Phase; lessonFilter: StatusFilter; onLessonFilterChange: (filter: StatusFilter) => void }

export function CurriculumView({ phase, lessonFilter, onLessonFilterChange, ...lesson }: CurriculumViewProps) {
  return (
    <div className="workspace">
      <div className="study-grid">
        <div className="study-main">
          <ModuleBanner phase={phase} completion={lesson.completion} />
          <LessonPanel key={lesson.topic.id} {...lesson} />
        </div>
        <LessonBrowser phase={phase} selectedId={lesson.topic.id} completion={lesson.completion} filter={lessonFilter} onFilterChange={onLessonFilterChange} onSelectTopic={lesson.onSelectTopic} />
      </div>
    </div>
  )
}
