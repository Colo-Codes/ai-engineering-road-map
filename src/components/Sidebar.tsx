import type { CSSProperties, ReactNode } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { twoDigits } from '../lib/format'
import { countCompleteLessons, moduleStatus } from '../lib/progress'
import type { CompletionState } from '../lib/progress'
import type { AppView, Phase } from '../types'
import { PrimaryNav } from './PrimaryNav'
import { ProgressTrack } from './ProgressTrack'

const MODULE_COLORS = ['#7160ed', '#ef8465', '#e3b43c', '#35b798', '#588ee1']

type SidebarProps = {
  open: boolean
  view: AppView
  phases: Phase[]
  activePhaseId: string
  completion: CompletionState
  // The study timer, pinned above the roadmap progress.
  tracker: ReactNode
  onNavigate: (view: AppView) => void
  onOpenModule: (phaseId: string) => void
  onResetProgress: () => void
  onClose: () => void
}

export function Sidebar({ open, view, phases, activePhaseId, completion, tracker, onNavigate, onOpenModule, onResetProgress, onClose }: SidebarProps) {
  const modules = phases.map((phase) => ({ phase, completed: countCompleteLessons(phase.topics, completion), status: moduleStatus(phase.topics, completion) }))
  const lessonCount = phases.reduce((sum, phase) => sum + phase.topics.length, 0)
  const completeCount = modules.reduce((sum, { completed }) => sum + completed, 0)
  const percent = lessonCount ? completeCount / lessonCount * 100 : 0

  return (
    <>
      {open && <button className="nav-scrim" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Phones only: the drawer carries the primary navigation that the top bar holds on wider screens. */}
        <div className="sidebar-drawer-head"><strong>Menu</strong><button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation"><X size={20} /></button></div>
        <PrimaryNav view={view} onNavigate={onNavigate} />
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
        <div className="sidebar-footer">{tracker}<div className="sidebar-progress"><div><span>Roadmap progress</span><strong>{Math.round(percent)}%</strong></div><ProgressTrack percent={percent} /><span className="sidebar-progress-count"><Check size={16} />{completeCount} of {lessonCount} lessons complete</span></div><button className="reset-button" onClick={() => { if (window.confirm('Reset every lesson\'s learning outcomes and exercises to not started?')) onResetProgress() }}><RotateCcw size={14} />Reset progress</button></div>
      </aside>
    </>
  )
}
