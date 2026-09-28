import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { TopicStatus } from '../types'
import { StatusIcon } from './StatusIcon'

// Sticky right-hand panel listing the sections of the current page.
export function SideRail({ title, count, label, className = '', children }: { title: string; count: number; label: string; className?: string; children: ReactNode }) {
  return (
    <aside className={`side-rail ${className}`} aria-label={label}>
      <div className="side-rail-heading"><h2>{title}</h2><span>{count}</span></div>
      {children}
    </aside>
  )
}

// Scrolls itself, never the page, to keep the selected link in view.
export function SideRailList({ label, selectedKey, children }: { label: string; selectedKey: string; children: ReactNode }) {
  const listRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const list = listRef.current
    const link = list?.querySelector<HTMLElement>('.rail-link.selected')
    if (!list || !link) return
    const listRect = list.getBoundingClientRect()
    const linkRect = link.getBoundingClientRect()
    if (linkRect.top < listRect.top) list.scrollBy({ top: linkRect.top - listRect.top, behavior: 'smooth' })
    else if (linkRect.bottom > listRect.bottom) list.scrollBy({ top: linkRect.bottom - listRect.bottom, behavior: 'smooth' })
  }, [selectedKey])

  return <nav ref={listRef} className="side-rail-list" aria-label={label}>{children}</nav>
}

type RailLinkProps = {
  title: string
  meta: ReactNode
  selected: boolean
  onClick: () => void
  status?: TopicStatus
  // Replaces the status marker for entries that have no completion state.
  icon?: ReactNode
  ariaCurrent?: 'step' | 'location'
}

export function RailLink({ title, meta, selected, onClick, status, icon, ariaCurrent = 'step' }: RailLinkProps) {
  return (
    <button className={`rail-link ${selected ? 'selected' : ''} ${status ?? ''}`} aria-current={selected ? ariaCurrent : undefined} onClick={onClick}>
      <span className="rail-link-marker">{icon ?? (status && <StatusIcon status={status} size={status === 'complete' ? 16 : 17} />)}</span>
      <span><span className="rail-link-title">{title}</span><span className="rail-link-meta">{meta}</span></span>
    </button>
  )
}
