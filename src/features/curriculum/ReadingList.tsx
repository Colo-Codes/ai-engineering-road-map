import { Fragment } from 'react'
import { BookOpen } from 'lucide-react'
import { resolveBookReferences } from '../../catalog'
import { bookCoverSrc } from '../../lib/covers'
import { pluralize } from '../../lib/format'
import { topicSources } from '../../lib/topics'
import type { BookLibrary, Topic } from '../../types'
import { ReadingBookCard } from './ReadingBookCard'
import { ReadingLinkCard } from './ReadingLinkCard'

export function ReadingList({ topic, library, onConfigurePath }: { topic: Topic; library: BookLibrary; onConfigurePath: (bookId: string) => void }) {
  const sources = topicSources(topic)

  return (
    <>
      <div className="reading-heading"><div><BookOpen size={20} /><h3>Reading list</h3></div><span>{pluralize(sources.length, 'source')}</span></div>
      <div className="source-grid">
        {sources.map((source, index) => {
          const references = resolveBookReferences(source.content, library.books)
          if (!references.length) return <ReadingLinkCard key={`${source.type}-${index}`} source={source} />
          return (
            <Fragment key={`${source.type}-${index}`}>
              {references.map((reference) => (
                <ReadingBookCard
                  key={`${reference.book.id}-${reference.locator}`}
                  reference={reference}
                  sourceType={source.type}
                  path={library.paths[reference.book.id] ?? ''}
                  coverSrc={bookCoverSrc(reference.book.id, library.covers)}
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
