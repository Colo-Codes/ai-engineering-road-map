import { BookOpen, Database, LibraryBig, Milestone, Timer } from 'lucide-react'
import type { AppView } from '../types'

const NAV_ITEMS: Array<{ view: AppView; label: string; Icon: typeof BookOpen }> = [
  { view: 'curriculum', label: 'Curriculum', Icon: BookOpen },
  { view: 'exercises', label: 'Exercises', Icon: Milestone },
  { view: 'study-time', label: 'Study time', Icon: Timer },
  { view: 'library', label: 'Resource library', Icon: LibraryBig },
  { view: 'database', label: 'Database', Icon: Database },
]

// Rendered in the top bar on wider screens and in the navigation drawer on phones; CSS shows one at a time.
// The title names each button when narrow top bars hide the labels.
export function PrimaryNav({ view, onNavigate }: { view: AppView; onNavigate: (view: AppView) => void }) {
  return (
    <nav className="primary-nav" aria-label="Primary navigation">
      {NAV_ITEMS.map(({ view: itemView, label, Icon }) => (
        <button key={itemView} className={view === itemView ? 'active' : ''} aria-current={view === itemView ? 'page' : undefined} title={label} onClick={() => onNavigate(itemView)}>
          <Icon size={18} /><span className="primary-nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
