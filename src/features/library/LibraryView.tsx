import { useEffect, useMemo, useState } from 'react'
import { BookOpen, ExternalLink, LibraryBig } from 'lucide-react'
import { Banner } from '../../components/Banner'
import { bookCoverSrc } from '../../lib/covers'
import { pluralize, resourceHost } from '../../lib/format'
import { collectBookUsage, collectWebResources } from '../../lib/library'
import { scrollToSection, scrollToTop } from '../../lib/scroll'
import { SOURCE_LABELS } from '../../lib/topics'
import type { BookLibrary, Topic } from '../../types'
import { ChapterListModal } from './ChapterListModal'
import { LibraryBookCard } from './LibraryBookCard'

type LibraryViewProps = {
  topics: Topic[]
  library: BookLibrary
  targetBookId: string
  onPathChange: (bookId: string, path: string) => void
  onCoverChange: (bookId: string, cover: string) => void
}

export function LibraryView({ topics, library, targetBookId, onPathChange, onCoverChange }: LibraryViewProps) {
  const [tab, setTab] = useState<'books' | 'links'>('books')
  const [chapterBookId, setChapterBookId] = useState('')
  // The view mounts fresh for each "add PDF path" request; the target only applies until the user switches tabs.
  const [targetId, setTargetId] = useState(targetBookId)
  const usage = useMemo(() => collectBookUsage(library.books, topics), [library.books, topics])
  const webResources = useMemo(() => collectWebResources(topics), [topics])
  const chapterUsage = usage.find(({ book }) => book.id === chapterBookId)
  const linkedCount = usage.filter(({ book }) => library.paths[book.id]?.trim()).length
  const tabs = [
    { id: 'books', label: 'Books', Icon: BookOpen, count: usage.length },
    { id: 'links', label: 'Web resources', Icon: ExternalLink, count: webResources.length },
  ] as const

  // The tabs stay pinned in the sticky banner, so they can be clicked from far down the previous list.
  const selectTab = (id: typeof tab) => {
    setTab(id)
    setTargetId('')
    scrollToTop()
  }

  useEffect(() => {
    if (!targetId) return
    const frame = window.requestAnimationFrame(() => {
      scrollToSection(`library-book-${targetId}`)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [targetId])

  return (
    <section className="books-view">
      <Banner
        tag={pluralize(usage.length + webResources.length, 'resource')}
        stats={[`${linkedCount} / ${pluralize(usage.length, 'PDF')} linked`]}
        title="Curriculum resource library"
        description="Books, guides and technical references assigned across the curriculum."
        className="banner-library"
        decoration={<LibraryBig />}
      >
        <div className="resource-tabs" role="tablist" aria-label="Resource types">
          {tabs.map(({ id, label, Icon, count }) => <button key={id} id={`resource-${id}-tab`} role="tab" aria-controls={`resource-${id}-panel`} aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => selectTab(id)}><Icon size={17} /><span>{label}</span><strong>{count}</strong></button>)}
        </div>
      </Banner>

      {tab === 'books' ? <div id="resource-books-panel" className="books-grid" role="tabpanel" aria-labelledby="resource-books-tab">
        {usage.map((item) => (
          <LibraryBookCard
            key={item.book.id}
            usage={item}
            path={library.paths[item.book.id] ?? ''}
            coverSrc={bookCoverSrc(item.book.id, library.covers)}
            hasCustomCover={Boolean(library.covers[item.book.id])}
            isTarget={item.book.id === targetId}
            onPathChange={(path) => onPathChange(item.book.id, path)}
            onCoverChange={(cover) => onCoverChange(item.book.id, cover)}
            onShowChapters={() => setChapterBookId(item.book.id)}
          />
        ))}
      </div> : <div id="resource-links-panel" className="web-resources-grid" role="tabpanel" aria-labelledby="resource-links-tab">
        {webResources.map((resource) => (
          <a className="web-resource-card" href={resource.url} target="_blank" rel="noreferrer" key={resource.url}>
            <span className="web-resource-icon"><ExternalLink size={19} /></span>
            <span className="web-resource-copy">
              <small>{resourceHost(resource.url)}</small>
              <strong>{resource.title}</strong>
              <span>Used in {pluralize(resource.lessonIds.size, 'lesson')}</span>
              <span className="web-resource-types">{[...resource.types].map((type) => <em key={type}>{SOURCE_LABELS[type]}</em>)}</span>
            </span>
          </a>
        ))}
      </div>}
      {chapterUsage && <ChapterListModal usage={chapterUsage} coverSrc={bookCoverSrc(chapterUsage.book.id, library.covers)} onClose={() => setChapterBookId('')} />}
    </section>
  )
}
