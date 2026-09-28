import type { ExerciseChecklist, ProgressMap, Topic, TopicStatus } from '../types'

export type CompletionState = { progress: ProgressMap; exerciseChecklist: ExerciseChecklist }

// Complete only when both the reading and the exercise are completed; anything started or completed is "in progress".
export function lessonStatus(topicId: string, state: CompletionState): TopicStatus {
  const reading = readingStatus(topicId, state)
  const exercise = exerciseStatus(topicId, state)
  if (reading === 'complete' && exercise === 'complete') return 'complete'
  if (reading !== 'not-started' || exercise !== 'not-started') return 'in-progress'
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

// Each click moves a lesson part on: not started → in progress → completed → not started.
const STATUS_CYCLE: Record<TopicStatus, TopicStatus> = { 'not-started': 'in-progress', 'in-progress': 'complete', complete: 'not-started' }

export const STATUS_LABELS: Record<TopicStatus, string> = { 'not-started': 'Not started', 'in-progress': 'In progress', complete: 'Completed' }

export function nextStatus(status: TopicStatus): TopicStatus {
  return STATUS_CYCLE[status]
}

export function readingStatus(topicId: string, { progress }: CompletionState): TopicStatus {
  return progress[topicId] ?? 'not-started'
}

export function exerciseStatus(topicId: string, { exerciseChecklist }: CompletionState): TopicStatus {
  return exerciseChecklist[topicId] ?? 'not-started'
}

// Advances one entry of the progress or exercise map; "not started" is stored as no entry.
export function cycleStatusEntry<S extends TopicStatus>(entries: Record<string, S>, topicId: string): Record<string, S> {
  const next = nextStatus(entries[topicId] ?? 'not-started')
  const updated = { ...entries }
  if (next === 'not-started') delete updated[topicId]
  else updated[topicId] = next as S
  return updated
}
