import { ExternalLink } from 'lucide-react'
import { resourceHost } from '../../lib/format'
import { SOURCE_LABELS } from '../../lib/topics'
import type { TopicSource } from '../../types'

export function ReadingLinkCard({ source }: { source: TopicSource }) {
  const link = source.content.match(/\[([^\]]+)]\(([^)]+)\)/)
  const title = (link ? link[1] : source.content).replace(/[_`]/g, '')
  const url = link?.[2]
  const className = `reading-book-card reading-link-card source-${source.type}`

  const body = (
    <>
      <span className="reading-link-icon"><ExternalLink size={20} /></span>
      <span className="reading-book-copy">
        <small>{SOURCE_LABELS[source.type]}</small>
        <strong>{title}</strong>
        {url && <span className="reading-link-host">{resourceHost(url)}</span>}
      </span>
    </>
  )

  return url
    ? <a className={className} href={url} target="_blank" rel="noreferrer">{body}</a>
    : <div className={className}>{body}</div>
}
