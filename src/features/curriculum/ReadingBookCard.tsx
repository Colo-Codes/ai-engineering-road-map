import { useState } from 'react'
import { ArrowRight, FileText, FolderOpen, LibraryBig, NotebookPen } from 'lucide-react'
import { openPdf } from '../../api'
import { BookCover } from '../../components/BookCover'
import { InlineText } from '../../components/InlineText'
import { Modal } from '../../components/Modal'
import { ResourceNotes } from '../../components/ResourceNotes'
import { describeBookReference } from '../../catalog'
import { hasResourceNote, resourceNoteSummary } from '../../lib/library'
import { SOURCE_LABELS } from '../../lib/topics'
import type { BookReference, OpenStatus, ResourceNote, TopicSourceType } from '../../types'

type ReadingBookCardProps = {
  reference: BookReference
  sourceType: TopicSourceType
  path: string
  coverSrc: string
  note: ResourceNote | undefined
  onNoteChange: (note: ResourceNote) => void
  onConfigurePath: (bookId: string) => void
}

export function ReadingBookCard({ reference, sourceType, path, coverSrc, note, onNoteChange, onConfigurePath }: ReadingBookCardProps) {
  const [open, setOpen] = useState(false)
  const [openStatus, setOpenStatus] = useState<OpenStatus | null>(null)
  const details = describeBookReference(reference)
  const { book } = reference
  const localPath = path.trim()

  const handleOpenPdf = async () => {
    setOpenStatus({ tone: 'working', message: 'Opening PDF…' })
    setOpenStatus(await openPdf(localPath))
  }

  return (
    <>
      <button
        className={`reading-book-card source-${sourceType}`}
        type="button"
        aria-haspopup="dialog"
        aria-label={`Open details for ${book.title}, ${details.label}`}
        onClick={() => setOpen(true)}
      >
        <span className="reading-cover-wrap"><BookCover src={coverSrc} book={book} /></span>
        <span className="reading-book-copy">
          <small>{SOURCE_LABELS[sourceType]}</small>
          <strong>{book.title}</strong>
          <span className="reading-book-authors">{book.authors}</span>
          <span className="reading-chapter"><FileText size={18} /><span><b>{details.label}</b>{details.title !== details.label && <em>{details.title}</em>}</span></span>
          {note && hasResourceNote(note) && <span className="resource-note-chip"><NotebookPen size={13} />{resourceNoteSummary(note)}</span>}
        </span>
      </button>

      {open && (
        <Modal className="book-modal" labelledBy={`book-title-${book.id}`} closeLabel="Close book details" onClose={() => setOpen(false)}>
          <div className="book-modal-overview">
            <BookCover className="book-modal-cover" src={coverSrc} book={book} />
            <div>
              <p className="book-modal-kicker">From the curriculum resource library</p>
              <h2 id={`book-title-${book.id}`}>{book.title}</h2>
              <p className="book-modal-authors">{book.authors}</p>
              <div className="book-modal-section book-modal-about">
                <span>About the book</span>
                <p><InlineText text={book.summary} /></p>
              </div>
            </div>
          </div>

          <div className="book-modal-chapter">
            <span className="detail-label">{details.label}</span>
            <strong>{details.title}</strong>
          </div>

          <ResourceNotes note={note} subject={book.title} onChange={onNoteChange} />

          <div className="book-modal-actions">
            {localPath
              ? <button className="book-modal-primary" onClick={handleOpenPdf} disabled={openStatus?.tone === 'working'}><FolderOpen size={18} />{openStatus?.tone === 'working' ? 'Opening…' : 'Open PDF'}</button>
              : <button className="book-modal-primary" onClick={() => { setOpen(false); onConfigurePath(book.id) }}><LibraryBig size={18} />Add PDF path in Resource Library<ArrowRight size={17} /></button>}
            <span>{localPath ? 'Uses the local path configured in the Resource Library.' : 'No local PDF path has been configured for this book yet.'}</span>
          </div>
          {openStatus && openStatus.tone !== 'working' && <p className={`open-file-status modal-status ${openStatus.tone}`} role="status">{openStatus.message}</p>}
        </Modal>
      )}
    </>
  )
}
