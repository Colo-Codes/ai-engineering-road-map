import type { LucideIcon } from 'lucide-react'
import { InlineText } from './InlineText'

// A labelled callout inside a lesson, such as its self-check or reading guidance.
export function LessonNote({ variant, label, text, Icon }: { variant: 'self-check' | 'reading'; label: string; text: string; Icon: LucideIcon }) {
  return (
    <aside className={`lesson-note lesson-note-${variant}`}>
      <Icon size={20} />
      <div><span className="detail-label">{label}</span><p><InlineText text={text} /></p></div>
    </aside>
  )
}
