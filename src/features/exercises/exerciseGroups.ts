import type { ExerciseChecklist, Phase, Topic } from '../../types'

export type ExerciseGroupData = {
  phase: Phase
  // `index` is the lesson's position in its module, for its "Lesson 1.6" label.
  rows: Array<{ topic: Topic; index: number; exercise: string }>
  done: number
}

export const CUSTOM_PROJECTS_ID = 'custom-projects'

export function groupSectionId(phaseId: string) {
  return `exercise-${phaseId}`
}

export function exerciseItemId(topicId: string) {
  return `exercise-item-${topicId}`
}

export function buildExerciseGroups(phases: Phase[], checklist: ExerciseChecklist): ExerciseGroupData[] {
  return phases
    .map((phase) => {
      const rows = phase.topics.flatMap((topic, index) => topic.appliedExercises ? [{ topic, index, exercise: topic.appliedExercises }] : [])
      return { phase, rows, done: rows.filter(({ topic }) => checklist[topic.id] === 'complete').length }
    })
    .filter(({ rows }) => rows.length)
}
