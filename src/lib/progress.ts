import type { ExerciseChecklist, ProgressMap, Topic, TopicStatus } from '../types'

export type CompletionState = { progress: ProgressMap; exerciseChecklist: ExerciseChecklist }

// Complete only when both the reading and the exercise are done; either alone is "in progress".
export function lessonStatus(topicId: string, { progress, exerciseChecklist }: CompletionState): TopicStatus {
  const readingDone = progress[topicId] === 'complete'
  const exerciseDone = Boolean(exerciseChecklist[topicId])
  if (readingDone && exerciseDone) return 'complete'
  if (readingDone || exerciseDone || progress[topicId] === 'in-progress') return 'in-progress'
  return 'not-started'
}

export function countCompleteLessons(topics: Topic[], state: CompletionState) {
  return topics.filter((topic) => lessonStatus(topic.id, state) === 'complete').length
}

export function progressStatus(done: number, total: number, started = done > 0): TopicStatus {
  if (done === total) return 'complete'
  return started ? 'in-progress' : 'not-started'
}

export function moduleStatus(topics: Topic[], state: CompletionState): TopicStatus {
  const completed = countCompleteLessons(topics, state)
  return progressStatus(completed, topics.length, completed > 0 || topics.some((topic) => lessonStatus(topic.id, state) === 'in-progress'))
}

export function toggleChecklistEntry(checklist: ExerciseChecklist, topicId: string): ExerciseChecklist {
  if (!checklist[topicId]) return { ...checklist, [topicId]: true }
  const next = { ...checklist }
  delete next[topicId]
  return next
}
