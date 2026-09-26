import { Github, Menu } from 'lucide-react'
import type { AppView } from '../types'
import { PrimaryNav } from './PrimaryNav'

type TopBarProps = {
  view: AppView
  onNavigate: (view: AppView) => void
  onOpenMenu: () => void
}

// Fixed across the top of every page; page containers clear it through --sticky-top.
export function TopBar({ view, onNavigate, onOpenMenu }: TopBarProps) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onOpenMenu} aria-label="Open navigation"><Menu size={22} /></button>
      <div className="brand-row">
        <div className="brand-copy"><strong>AI Engineering Roadmap</strong><a className="brand-source" href="https://github.com/Colo-Codes/ai-engineering-road-map" target="_blank" rel="noreferrer"><Github size={14} />View source</a></div>
      </div>
      <PrimaryNav view={view} onNavigate={onNavigate} />
    </header>
  )
}
