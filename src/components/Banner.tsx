import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useStuck } from '../hooks/useStuck'
import { InlineText } from './InlineText'
import { ProgressTrack } from './ProgressTrack'

type BannerProps = {
  tag: string
  stats: string[]
  title: string
  description: string
  // Omit for pages without a completion measure; the progress bar is then hidden.
  percent?: number
  action?: ReactNode
  // Faint artwork in the top-right corner; defaults to the abstract ring shapes.
  decoration?: ReactNode
  className?: string
  children?: ReactNode
}

// Sticky page header that lifts and narrows slightly once content scrolls behind it.
export function Banner({ tag, stats, title, description, percent, action, decoration, className = '', children }: BannerProps) {
  const { sentinelRef, stickyRef, stuck } = useStuck<HTMLElement>()

  // Publishes the banner's height to its container so siblings can set scroll-margin to clear it.
  useEffect(() => {
    const banner = stickyRef.current
    const container = banner?.parentElement
    if (!banner || !container) return
    const update = () => container.style.setProperty('--banner-height', `${banner.offsetHeight}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(banner)
    return () => {
      observer.disconnect()
      container.style.removeProperty('--banner-height')
    }
  }, [stickyRef])

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="banner-sentinel" />
      <section ref={stickyRef} className={`banner ${className} ${stuck ? 'is-stuck' : ''}`}>
        <div className="banner-top"><span className="banner-tag">{tag}</span><span className="banner-stats">{stats.map((stat, index) => <span key={index}>{stat}</span>)}</span></div>
        <div className="banner-heading"><h1>{title}</h1>{action}</div>
        <p><InlineText text={description} /></p>
        {children}
        {percent !== undefined && <div className="banner-progress"><span>{percent}% complete</span><ProgressTrack percent={percent} /></div>}
        {decoration
          ? <div className="banner-decoration" aria-hidden="true">{decoration}</div>
          : <div className="banner-shapes" aria-hidden="true"><i /><i /><i /></div>}
      </section>
    </>
  )
}
