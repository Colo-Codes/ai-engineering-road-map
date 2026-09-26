import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react'
import { CompletionToggle } from '../../components/CompletionToggle'
import { GoalCard } from '../../components/GoalCard'
import { InlineText } from '../../components/InlineText'
import { StudyTimerControl } from '../../components/StudyTimerControl'
import type { StudyTracker } from '../../hooks/useStudyTracker'
import { lessonLabel } from '../../lib/format'
import type { CompletionState } from '../../lib/progress'
import { lessonTarget } from '../../lib/studyTime'
import type { BookLibrary, ResourceNote, Topic } from '../../types'
import { ReadingList } from './ReadingList'

export type LessonPanelProps = {
  topic: Topic
  lessonIndex: number
  previousId?: string
  nextId?: string
  library: BookLibrary
  completion: CompletionState
  studyTracker: StudyTracker
  onSelectTopic: (topicId: string) => void
  onToggleReading: (topicId: string) => void
  onToggleExercise: (topicId: string) => void
  onOpenExercise: (topicId: string) => void
  onConfigurePath: (bookId: string) => void
  onNoteChange: (key: string, note: ResourceNote) => void
}

export function LessonPanel({ topic, lessonIndex, previousId, nextId, library, completion, studyTracker, onSelectTopic, onToggleReading, onToggleExercise, onOpenExercise, onConfigurePath, onNoteChange }: LessonPanelProps) {
  return (
    <article className="lesson-panel">
      <div className="lesson-meta"><span>{lessonLabel(lessonIndex)}</span>{topic.isExtension && <span className="extension-badge">Extension</span>}</div>
      <h2>{topic.title}</h2>
      {topic.description && <p className="lesson-description"><InlineText text={topic.description} /></p>}
      <div className="lesson-goal-grid">
        <GoalCard variant="learning" label="Learning outcomes" text={topic.learningGoal ?? ''}>
          <div className="goal-card-actions">
            <CompletionToggle done={completion.progress[topic.id] === 'complete'} subject="learning outcomes" onToggle={() => onToggleReading(topic.id)} />
          </div>
          <StudyTimerControl target={lessonTarget(topic, 'theory')} tracker={studyTracker} />
        </GoalCard>
        <GoalCard variant="building" label="Exercises" text={topic.appliedExercises ?? ''}>
          <div className="goal-card-actions">
            <CompletionToggle done={Boolean(completion.exerciseChecklist[topic.id])} subject="exercises" onToggle={() => onToggleExercise(topic.id)} />
            {topic.appliedExercises && <button type="button" className="goal-card-link" onClick={() => onOpenExercise(topic.id)}>See all exercises<ArrowRight size={14} /></button>}
          </div>
          <StudyTimerControl target={lessonTarget(topic, 'exercise')} tracker={studyTracker} />
        </GoalCard>
      </div>
      <p className="goal-grid-note">Both learning outcomes and exercises must be marked completed for this lesson to count as complete.</p>
      <ReadingList topic={topic} library={library} onConfigurePath={onConfigurePath} onNoteChange={onNoteChange} />
      {topic.readingNote && <aside className="reading-note"><Lightbulb size={20} /><div><span className="detail-label">Reading guidance</span><p><InlineText text={topic.readingNote} /></p></div></aside>}
      <div className="lesson-footer"><div className="lesson-navigation"><button disabled={!previousId} onClick={() => previousId && onSelectTopic(previousId)} aria-label="Previous lesson"><ArrowLeft size={19} /></button><button className="next-lesson" disabled={!nextId} onClick={() => nextId && onSelectTopic(nextId)}>Next lesson<ArrowRight size={18} /></button></div></div>
    </article>
  )
}
