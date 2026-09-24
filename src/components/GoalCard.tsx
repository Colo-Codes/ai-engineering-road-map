import type { ReactNode } from 'react'
import { GraduationCap, Hammer } from 'lucide-react'
import { InlineText } from './InlineText'

const VARIANTS = {
  learning: { className: 'learning-goal', Icon: GraduationCap },
  building: { className: 'building-goal', Icon: Hammer },
}

export function GoalCard({ variant, label, text, children }: { variant: keyof typeof VARIANTS; label: string; text: string; children?: ReactNode }) {
  const { className, Icon } = VARIANTS[variant]
  return (
    <article className={`goal-card ${className}`}>
      <span className="goal-icon"><Icon size={20} /></span>
      <div><span className="detail-label">{label}</span><p><InlineText text={text} /></p>{children}</div>
    </article>
  )
}
