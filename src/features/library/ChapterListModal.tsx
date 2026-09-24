import type { CSSProperties } from 'react'
import { BookCover } from '../../components/BookCover'
import { Modal } from '../../components/Modal'
import { pluralize } from '../../lib/format'
import { chaptersUsedLabel } from '../../lib/library'
import type { BookUsage } from '../../lib/library'

function unitLabel(unit: string) {
  return unit.startsWith('part ') || unit.startsWith('appendix ') ? unit.replace(/^./, (letter) => letter.toUpperCase()) : `Chapter ${unit}`
}

export function ChapterListModal({ usage: { book, references, units }, coverSrc, onClose }: { usage: BookUsage; coverSrc: string; onClose: () => void }) {
  return (
    <Modal className="chapter-list-modal" style={{ '--book-color': book.color } as CSSProperties} labelledBy={`chapter-list-title-${book.id}`} closeLabel="Close chapter list" onClose={onClose}>
      <header className="chapter-list-header">
        <BookCover src={coverSrc} book={book} />
        <div>
          <div className="chapter-list-badges"><p>{chaptersUsedLabel(units)}</p>{book.isOptional && <span>Optional</span>}</div>
          <h2 id={`chapter-list-title-${book.id}`}>{book.title}</h2>
          <span>{book.authors}</span>
        </div>
      </header>
      <p className="chapter-list-intro">Specific sections referenced across {pluralize(references.length, 'lesson source')} in the roadmap.</p>
      <div className="chapter-list-scroll">
        {units.length
          ? <ol>{units.map((unit) => <li key={unit}><div><span className="chapter-label">{unitLabel(unit)}</span><p>{book.chapters[unit] || 'Referenced section'}</p></div></li>)}</ol>
          : <p className="broad-reference">Used as a broad supporting reference rather than for a specific chapter.</p>}
      </div>
    </Modal>
  )
}
