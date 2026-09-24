import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Check, ExternalLink, FileText, FolderOpen, ImagePlus, RotateCcw } from 'lucide-react'
import { openPdf } from '../../api'
import { BookCover } from '../../components/BookCover'
import { InlineText } from '../../components/InlineText'
import { createCoverDataUrl } from '../../lib/covers'
import { pluralize } from '../../lib/format'
import { chaptersUsedLabel } from '../../lib/library'
import type { BookUsage } from '../../lib/library'
import type { OpenStatus } from '../../types'

type BookPathEditorProps = { bookId: string; path: string; onSave: (draft: string) => void; onCancel: () => void; onRemove: () => void }

function BookPathEditor({ bookId, path, onSave, onCancel, onRemove }: BookPathEditorProps) {
  const [draft, setDraft] = useState(path)
  return (
    <div className="book-path-editor">
      <label htmlFor={`book-path-${bookId}`}>Local PDF path</label>
      <input id={`book-path-${bookId}`} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') onSave(draft); if (event.key === 'Escape') onCancel() }} placeholder="~/Books/example.pdf" spellCheck={false} autoFocus />
      <div className="path-editor-actions">
        <button className="save-path-button" onClick={() => onSave(draft)}>Save path</button>
        <button className="clear-path-button" onClick={onCancel}>Cancel</button>
        {path && <button className="remove-path-button" onClick={onRemove}>Remove path</button>}
      </div>
    </div>
  )
}

type LibraryBookCardProps = {
  usage: BookUsage
  path: string
  coverSrc: string
  hasCustomCover: boolean
  isTarget: boolean
  onPathChange: (path: string) => void
  onCoverChange: (cover: string) => void
  onShowChapters: () => void
}

export function LibraryBookCard({ usage: { book, references, units }, path, coverSrc, hasCustomCover, isTarget, onPathChange, onCoverChange, onShowChapters }: LibraryBookCardProps) {
  const [editingPath, setEditingPath] = useState(isTarget)
  const [status, setStatus] = useState<OpenStatus | null>(null)

  const handleOpenPdf = async () => {
    const localPath = path.trim()
    if (!localPath) {
      setEditingPath(true)
      setStatus({ tone: 'error', message: 'Add the local PDF path to open this book.' })
      return
    }
    setStatus({ tone: 'working', message: 'Opening PDF…' })
    setStatus(await openPdf(localPath))
  }

  const savePath = (draft: string) => {
    const nextPath = draft.trim()
    if (!nextPath) {
      setStatus({ tone: 'error', message: 'Enter the path to a PDF on this computer.' })
      return
    }
    onPathChange(nextPath)
    setEditingPath(false)
    setStatus({ tone: 'success', message: 'Local PDF path saved.' })
  }

  const updateCover = async (file?: File) => {
    if (!file) return
    try {
      onCoverChange(await createCoverDataUrl(file))
      setStatus({ tone: 'success', message: 'Custom book cover saved.' })
    } catch (error) {
      setStatus({ tone: 'error', message: error instanceof Error ? error.message : 'The cover could not be saved.' })
    }
  }

  return (
    <article id={`library-book-${book.id}`} className={`library-book${isTarget ? ' path-target' : ''}`} style={{ '--book-color': book.color } as CSSProperties}>
      <div className="library-cover-column">
        <button className="library-cover-button" onClick={handleOpenPdf} aria-label={`Open ${book.title} PDF`}>
          <BookCover src={coverSrc} book={book} />
          <span><FolderOpen size={18} /> Open PDF</span>
        </button>
        <div className="cover-actions">
          <label className="cover-upload-button"><ImagePlus size={15} /><span>{hasCustomCover ? 'Change cover' : 'Set cover'}</span><input type="file" accept="image/*" onChange={(event) => { void updateCover(event.target.files?.[0]); event.currentTarget.value = '' }} /></label>
          {hasCustomCover && <button className="reset-cover-button" onClick={() => onCoverChange('')} aria-label={`Restore default cover for ${book.title}`} title="Restore default cover"><RotateCcw size={14} /></button>}
        </div>
      </div>
      <div className="library-book-content">
        <div className="library-book-tags"><div className="chapter-counter"><FileText size={16} />{chaptersUsedLabel(units)}</div>{book.isOptional && <span className="optional-book-badge">Optional</span>}</div>
        <button className="library-title" onClick={handleOpenPdf}>{book.title}</button>
        <p className="library-authors">{book.authors}</p>
        <p className="library-summary-copy"><InlineText text={book.summary} /></p>
        {book.referenceUrl && <a className="book-reference-link" href={book.referenceUrl} target="_blank" rel="noreferrer">View reference site<ExternalLink size={14} /></a>}
      </div>
      <div className="library-book-details">
        <button className="chapters-toggle" aria-haspopup="dialog" onClick={onShowChapters}>
          <span>{units.length ? `View all ${pluralize(units.length, 'chapter')}` : 'View reference details'}</span>
        </button>
        {editingPath
          ? <BookPathEditor bookId={book.id} path={path} onSave={savePath} onCancel={() => setEditingPath(false)} onRemove={() => { onPathChange(''); setEditingPath(false) }} />
          : <div className="book-path-summary">
            {path && <span className="pdf-linked"><Check size={16} />PDF linked locally</span>}
            <div className="book-path-actions">
              {path && <button className="open-pdf-button" onClick={handleOpenPdf}><FolderOpen size={17} />Open PDF</button>}
              <button className={path ? 'change-path-button' : 'add-path-button'} onClick={() => setEditingPath(true)}><FolderOpen size={17} />{path ? 'Change path' : 'Add PDF path'}</button>
            </div>
          </div>}
        {status && <p className={`open-file-status ${status.tone}`} role="status">{status.message}</p>}
        <p className="reference-count">Referenced in {pluralize(references.length, 'lesson source')}.</p>
      </div>
    </article>
  )
}
