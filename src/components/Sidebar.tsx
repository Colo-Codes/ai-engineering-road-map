import type { CSSProperties } from 'react'
import { BookOpen, Check, Database, Github, LibraryBig, Milestone, RotateCcw, X } from 'lucide-react'
import { twoDigits } from '../lib/format'
import { countCompleteLessons, moduleStatus } from '../lib/progress'
import type { CompletionState } from '../lib/progress'
import type { AppView, Phase } from '../types'
import { ProgressTrack } from './ProgressTrack'

const NAV_ITEMS: Array<{ view: AppView; label: string; Icon: typeof BookOpen }> = [
  { view: 'curriculum', label: 'Curriculum', Icon: BookOpen },
  { view: 'exercises', label: 'Exercises', Icon: Milestone },
  { view: 'library', label: 'Resource library', Icon: LibraryBig },
  { view: 'database', label: 'Database', Icon: Database },
]
const MODULE_COLORS = ['#7160ed', '#ef8465', '#e3b43c', '#35b798', '#588ee1']

type SidebarProps = {
  open: boolean
  view: AppView
  phases: Phase[]
  activePhaseId: string
  completion: CompletionState
  onNavigate: (view: AppView) => void
  onOpenModule: (phaseId: string) => void
  onResetProgress: () => void
  onClose: () => void
}

export function Sidebar({ open, view, phases, activePhaseId, completion, onNavigate, onOpenModule, onResetProgress, onClose }: SidebarProps) {
  const modules = phases.map((phase) => ({ phase, completed: countCompleteLessons(phase.topics, completion), status: moduleStatus(phase.topics, completion) }))
  const lessonCount = phases.reduce((sum, phase) => sum + phase.topics.length, 0)
  const completeCount = modules.reduce((sum, { completed }) => sum + completed, 0)
  const percent = lessonCount ? completeCount / lessonCount * 100 : 0

  return (
    <>
      {open && <button className="nav-scrim" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand-row"><div className="brand-copy"><strong>AI Engineering Roadmap</strong><a className="brand-source" href="https://github.com/Colo-Codes/ai-engineering-road-map" target="_blank" rel="noreferrer"><Github size={14} />View source</a></div><button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation"><X size={20} /></button></div>
        <nav className="primary-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map(({ view: itemView, label, Icon }) => <button key={itemView} className={view === itemView ? 'active' : ''} onClick={() => onNavigate(itemView)}><Icon size={18} />{label}</button>)}
        </nav>
        <div className="phase-nav-label"><span>Modules</span><span>{phases.length}</span></div>
        <nav className="phase-nav" aria-label="Roadmap modules">
          {modules.map(({ phase, completed, status }, index) => {
            const active = phase.id === activePhaseId
            return <button key={phase.id} className={`${active ? 'selected ' : ''}module-${status}`} aria-label={`${phase.title}, ${status.replace(/-/g, ' ')}`} aria-current={active ? 'page' : undefined} onClick={() => onOpenModule(phase.id)} style={{ '--module-color': MODULE_COLORS[index % MODULE_COLORS.length] } as CSSProperties}>
              <span className="phase-nav-number">{twoDigits(phase.number)}</span>
              <span className="phase-nav-copy"><span className="phase-nav-title">{phase.title}</span><span className="phase-nav-count">{completed} / {phase.topics.length} lessons</span></span>
            </button>
          })}
        </nav>
        <div className="sidebar-footer"><div className="sidebar-progress"><div><span>Roadmap progress</span><strong>{Math.round(percent)}%</strong></div><ProgressTrack percent={percent} /><span className="sidebar-progress-count"><Check size={16} />{completeCount} of {lessonCount} lessons complete</span></div><button className="reset-button" onClick={() => { if (window.confirm('Reset every lesson\'s learning outcomes and exercises to not started?')) onResetProgress() }}><RotateCcw size={14} />Reset progress</button></div>
      </aside>
    </>
  )
}
