import { Fragment } from 'react'
import { BookOpen } from 'lucide-react'
import { resolveBookReferences } from '../../catalog'
import { bookCoverSrc } from '../../lib/covers'
import { pluralize } from '../../lib/format'
import { bookResourceKey } from '../../lib/library'
import { topicSources } from '../../lib/topics'
import type { BookLibrary, ResourceNote, Topic } from '../../types'
import { ReadingBookCard } from './ReadingBookCard'
import { ReadingLinkCard } from './ReadingLinkCard'

type ReadingListProps = {
  topic: Topic
  library: BookLibrary
  onConfigurePath: (bookId: string) => void
  onNoteChange: (key: string, note: ResourceNote) => void
}

export function ReadingList({ topic, library, onConfigurePath, onNoteChange }: ReadingListProps) {
  const sources = topicSources(topic)

  return (
    <>
      <div className="reading-heading"><div><BookOpen size={20} /><h3>Reading list</h3></div><span>{pluralize(sources.length, 'source')}</span></div>
      <div className="source-grid">
        {sources.map((source, index) => {
          const references = resolveBookReferences(source.content, library.books)
          if (!references.length) return <ReadingLinkCard key={`${source.type}-${index}`} source={source} notes={library.notes} onNoteChange={onNoteChange} />
          return (
            <Fragment key={`${source.type}-${index}`}>
              {references.map((reference) => (
                <ReadingBookCard
                  key={`${reference.book.id}-${reference.locator}`}
                  reference={reference}
                  sourceType={source.type}
                  path={library.paths[reference.book.id] ?? ''}
                  coverSrc={bookCoverSrc(reference.book.id, library.covers)}
                  note={library.notes[bookResourceKey(reference.book.id)]}
                  onNoteChange={(note) => onNoteChange(bookResourceKey(reference.book.id), note)}
                  onConfigurePath={onConfigurePath}
                />
              ))}
            </Fragment>
          )
        })}
      </div>
    </>
  )
}
