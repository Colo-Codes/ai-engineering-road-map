import { Banner } from '../../components/Banner'
import { GoalCard } from '../../components/GoalCard'
import { moduleLabel } from '../../lib/format'
import { countCompleteLessons } from '../../lib/progress'
import type { CompletionState } from '../../lib/progress'
import type { Phase } from '../../types'

export function ModuleBanner({ phase, completion }: { phase: Phase; completion: CompletionState }) {
  const lessonCount = phase.topics.length
  const lessonsDone = countCompleteLessons(phase.topics, completion)
  const exercisesDone = phase.topics.filter((topic) => completion.exerciseChecklist[topic.id]).length

  return (
    <Banner
      tag={moduleLabel(phase.number)}
      stats={[`${lessonsDone} / ${lessonCount} lessons`, `${exercisesDone} / ${lessonCount} exercises`]}
      title={phase.title}
      description={phase.goal}
      percent={lessonCount ? Math.round(lessonsDone / lessonCount * 100) : 0}
    >
      <section className="phase-goal-grid" aria-label="Module goals">
        <GoalCard variant="learning" label="Module learning outcomes" text={phase.learningGoal ?? phase.goal} />
        <GoalCard variant="building" label="Module practical assessment" text={phase.buildingGoal ?? phase.outcome} />
      </section>
    </Banner>
  )
}
