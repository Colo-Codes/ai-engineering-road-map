import { getBookReferenceUnits, resolveBookReferences } from '../catalog'
import type { Book, BookReference, Topic, TopicSourceType } from '../types'
import { pluralize } from './format'
import { extractWebLinks, topicSources } from './topics'

export type BookUsage = { book: Book; references: BookReference[]; units: string[] }

export type WebResource = {
  url: string
  title: string
  lessonIds: Set<string>
  types: Set<TopicSourceType>
}

export function chaptersUsedLabel(units: string[]) {
  return units.length ? `${pluralize(units.length, 'chapter')} used` : 'Reference only'
}

function compareUnits(a: string, b: string) {
  const aNumber = Number(a)
  const bNumber = Number(b)
  return Number.isNaN(aNumber) || Number.isNaN(bNumber) ? a.localeCompare(b) : aNumber - bNumber
}

export function collectBookUsage(books: Book[], topics: Topic[]): BookUsage[] {
  const references = topics.flatMap((topic) => topicSources(topic)).flatMap((source) => resolveBookReferences(source.content, books))
  return books
    .map((book) => {
      const bookReferences = references.filter((reference) => reference.book.id === book.id)
      const units = [...new Set(bookReferences.flatMap(getBookReferenceUnits))].sort(compareUnits)
      return { book, references: bookReferences, units }
    })
    .filter(({ references: bookReferences }) => bookReferences.length > 0)
}

export function collectWebResources(topics: Topic[]): WebResource[] {
  const resources = new Map<string, WebResource>()
  topics.forEach((topic) => {
    topicSources(topic).forEach((source) => {
      extractWebLinks(source.content).forEach((link) => {
        const existing = resources.get(link.url)
        if (existing) {
          existing.lessonIds.add(topic.id)
          existing.types.add(source.type)
        } else {
          resources.set(link.url, { ...link, lessonIds: new Set([topic.id]), types: new Set([source.type]) })
        }
      })
    })
  })
  return [...resources.values()].sort((a, b) => a.title.localeCompare(b.title))
}
