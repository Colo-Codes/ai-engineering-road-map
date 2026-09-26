import { useId, useState } from 'react'
import { ExternalLink, NotebookPen } from 'lucide-react'
import { Modal } from '../../components/Modal'
import { ResourceNotes } from '../../components/ResourceNotes'
import { resourceHost } from '../../lib/format'
import { hasResourceNote, resourceNoteSummary, webResourceKey } from '../../lib/library'
import { SOURCE_LABELS } from '../../lib/topics'
import type { ResourceNote, ResourceNotes as ResourceNotesMap, TopicSource } from '../../types'

type ReadingLinkCardProps = {
  source: TopicSource
  notes: ResourceNotesMap
  onNoteChange: (key: string, note: ResourceNote) => void
}

// A web source opens a details dialog with your notes and an "Open resource" button, rather than leaving the app at once.
export function ReadingLinkCard({ source, notes, onNoteChange }: ReadingLinkCardProps) {
  const headingId = useId()
  const [open, setOpen] = useState(false)
  const link = source.content.match(/\[([^\]]+)]\(([^)]+)\)/)
  const title = (link ? link[1] : source.content).replace(/[_`]/g, '')
  const url = link?.[2]
  const note = url ? notes[webResourceKey(url)] : undefined
  const className = `reading-book-card reading-link-card source-${source.type}`

  const body = (
    <>
      <span className="reading-link-icon"><ExternalLink size={20} /></span>
      <span className="reading-book-copy">
        <small>{SOURCE_LABELS[source.type]}</small>
        <strong>{title}</strong>
        {url && <span className="reading-link-host">{resourceHost(url)}</span>}
        {note && hasResourceNote(note) && <span className="resource-note-chip"><NotebookPen size={13} />{resourceNoteSummary(note)}</span>}
      </span>
    </>
  )

  if (!url) return <div className={className}>{body}</div>

  return (
    <>
      <button type="button" className={className} aria-haspopup="dialog" aria-label={`Open details for ${title}`} onClick={() => setOpen(true)}>{body}</button>
      {open && (
        <Modal className="book-modal resource-modal" labelledBy={headingId} closeLabel="Close resource details" onClose={() => setOpen(false)}>
          <header className="resource-modal-header">
            <p className="book-modal-kicker">{SOURCE_LABELS[source.type]}</p>
            <h2 id={headingId}>{title}</h2>
            <p className="book-modal-authors">{resourceHost(url)}</p>
          </header>
          <ResourceNotes note={note} subject={title} onChange={(next) => onNoteChange(webResourceKey(url), next)} />
          <div className="book-modal-actions">
            <a className="book-modal-primary" href={url} target="_blank" rel="noreferrer"><ExternalLink size={18} />Open resource</a>
            <span>Opens {resourceHost(url)} in a new tab.</span>
          </div>
        </Modal>
      )}
    </>
  )
}
