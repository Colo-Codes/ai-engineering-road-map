import { Circle, CircleCheck } from 'lucide-react'

export function CompletionToggle({ done, subject, onToggle }: { done: boolean; subject: string; onToggle: () => void }) {
  return (
    <button type="button" className={`goal-card-toggle ${done ? 'done' : ''}`} aria-pressed={done} aria-label={`Mark ${subject} as ${done ? 'not completed' : 'completed'}`} onClick={onToggle}>
      {done ? <CircleCheck size={16} /> : <Circle size={16} />}Completed
    </button>
  )
}
