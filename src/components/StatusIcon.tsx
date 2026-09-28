import { Check, Circle, CircleCheck, CircleDot } from 'lucide-react'
import type { TopicStatus } from '../types'

const STATUS_ICONS: Record<TopicStatus, typeof Circle> = { 'not-started': Circle, 'in-progress': CircleDot, complete: Check }

// ○ not started, ◉ in progress, ✓ complete: shared by the lesson rail, the completion toggles and the exercise rows.
// `circled` draws "complete" as a check inside a circle, for the round exercise-row buttons.
export function StatusIcon({ status, size, circled = false }: { status: TopicStatus; size: number; circled?: boolean }) {
  const Icon = circled && status === 'complete' ? CircleCheck : STATUS_ICONS[status]
  return <Icon size={size} aria-hidden="true" />
}
