import { ArrowRight, Circle, CircleCheck } from 'lucide-react'
import { InlineText } from '../../components/InlineText'
import { StudyTimerControl } from '../../components/StudyTimerControl'
import type { StudyTracker } from '../../hooks/useStudyTracker'
import { moduleLabel } from '../../lib/format'
import { lessonTarget } from '../../lib/studyTime'
import type { ExerciseChecklist } from '../../types'
import { exerciseItemId, groupSectionId } from './exerciseGroups'
import type { ExerciseGroupData } from './exerciseGroups'

type ExerciseGroupProps = {
  group: ExerciseGroupData
  checklist: ExerciseChecklist
  highlightTopicId: string
  studyTracker: StudyTracker
  onHighlightEnd: () => void
  onToggleExercise: (topicId: string) => void
  onOpenModule: (phaseId: string) => void
  onSelectTopic: (topicId: string) => void
}

export function ExerciseGroup({ group: { phase, rows, done }, checklist, highlightTopicId, studyTracker, onHighlightEnd, onToggleExercise, onOpenModule, onSelectTopic }: ExerciseGroupProps) {
  return (
    <section className="exercise-group" id={groupSectionId(phase.id)}>
      <header className="exercise-group-header">
        <div>
          <span className="detail-label">{moduleLabel(phase.number)}</span>
          <h2>{phase.title}</h2>
        </div>
        <div className="exercise-group-meta">
          <span>{done} / {rows.length} done</span>
          <button type="button" className="exercise-group-open" onClick={() => onOpenModule(phase.id)}>Open module<ArrowRight size={15} /></button>
        </div>
      </header>
      <ul className="exercise-list">
        {rows.map(({ topic, exercise }) => {
          const checked = Boolean(checklist[topic.id])
          return (
            <li key={topic.id} id={exerciseItemId(topic.id)} className={`${checked ? 'checked' : ''} ${topic.id === highlightTopicId ? 'flash-highlight' : ''}`} onAnimationEnd={(event) => { if (event.target === event.currentTarget) onHighlightEnd() }}>
              <button type="button" className="exercise-check" aria-pressed={checked} onClick={() => onToggleExercise(topic.id)} aria-label={`Mark "${topic.title}" exercise as ${checked ? 'not done' : 'done'}`}>
                {checked ? <CircleCheck size={22} /> : <Circle size={22} />}
              </button>
              <div className="exercise-copy">
                <button type="button" className="exercise-lesson-link" onClick={() => onSelectTopic(topic.id)}>{topic.title}</button>
                <p><InlineText text={exercise} /></p>
                <StudyTimerControl target={lessonTarget(topic, 'exercise')} tracker={studyTracker} />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
