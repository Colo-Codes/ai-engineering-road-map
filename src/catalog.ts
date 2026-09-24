import type { Book, BookReference } from './types'

export function resolveBookReferences(source: string, books: Book[]): BookReference[] {
  const searchableSource = source.replace(/[_`]/g, '')
  const lowerSource = searchableSource.toLocaleLowerCase()
  const matches = books
    .flatMap((book) => book.aliases.map((alias) => ({ book, alias })))
    .sort((a, b) => b.alias.length - a.alias.length)
    .map(({ book, alias }) => ({ book, alias, index: lowerSource.indexOf(alias.toLocaleLowerCase()) }))
    .filter((match) => match.index >= 0)
    .filter((match, index, all) => all.findIndex((candidate) => candidate.book.id === match.book.id) === index)
    .filter((match, index, all) => !all.some((candidate, candidateIndex) => candidateIndex < index
      && candidate.book.id !== match.book.id
      && candidate.index <= match.index
      && candidate.index + candidate.alias.length >= match.index + match.alias.length))
    .sort((a, b) => a.index - b.index)

  return matches.map((match) => ({
    book: match.book,
    locator: matches.length === 1
      ? searchableSource.slice(match.index + match.alias.length)
        .replace(/^\s*,\s*/, '')
        .replace(/^\d+(?:st|nd|rd|th)\s+ed(?:ition)?\.?,?\s*/i, '')
        .replace(/\.\s*$/, '')
        .trim()
      : '',
  }))
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => String(start + index))
}

// `keys` are the book.chapters keys a locator points at; `fallbackTitle` is shown when none of them has a title.
type ParsedLocator = { label: string; keys: string[]; fallbackTitle: string }

function parseLocator({ book, locator }: BookReference): ParsedLocator | null {
  if (!locator) return null
  const normalized = locator.replace(/[–—]/g, '-').trim()

  const appendix = normalized.match(/Appendix\s+([A-Z])/i)
  if (appendix) {
    return { label: `Appendix ${appendix[1].toLocaleUpperCase()}`, keys: [`appendix ${appendix[1].toLocaleLowerCase()}`], fallbackTitle: normalized }
  }

  const part = normalized.match(/Parts?\s+([IVX]+)(?:\s*-\s*([IVX]+))?/i)
  if (part) {
    const start = ROMAN_NUMERALS.indexOf(part[1].toLocaleUpperCase())
    const end = part[2] ? ROMAN_NUMERALS.indexOf(part[2].toLocaleUpperCase()) : start
    const keys = start >= 0 && end >= start ? ROMAN_NUMERALS.slice(start, end + 1).map((value) => `part ${value.toLocaleLowerCase()}`) : []
    return { label: normalized, keys, fallbackTitle: normalized }
  }

  const chapter = normalized.match(/Chapters?\s+(.+)/i)
  if (chapter) {
    const hyphenRange = chapter[1].match(/(\d+)\s*-\s*(\d+)/)
    const keys = hyphenRange
      ? range(Number(hyphenRange[1]), Number(hyphenRange[2]))
      : [...chapter[1].matchAll(/\d+/g)].map((match) => match[0])
    return { label: normalized, keys, fallbackTitle: normalized }
  }

  if (/classification/i.test(normalized)) {
    return { label: normalized, keys: [book.id === 'islp' ? '4' : '3'], fallbackTitle: 'Classification material' }
  }

  return { label: normalized, keys: [], fallbackTitle: normalized }
}

export function describeBookReference(reference: BookReference) {
  const parsed = parseLocator(reference)
  if (!parsed) return { label: 'Book overview', title: 'Use the book as a broad reference.' }
  const titles = parsed.keys.map((key) => reference.book.chapters[key]).filter(Boolean)
  return { label: parsed.label, title: titles.join(' · ') || parsed.fallbackTitle }
}

export function getBookReferenceUnits(reference: BookReference): string[] {
  return parseLocator(reference)?.keys ?? []
}
