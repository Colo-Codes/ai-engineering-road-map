import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { bookInitials } from '../lib/covers'
import type { Book } from '../types'

export function BookCover({ src, book, className }: { src: string; book: Book; className?: string }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  const classes = ['book-cover', className].filter(Boolean).join(' ')
  if (failed) {
    return <div className={`${classes} book-cover-fallback`} style={{ '--book-color': book.color } as CSSProperties} aria-hidden="true">{bookInitials(book.title)}</div>
  }
  return <img className={classes} src={src} alt="" onError={() => setFailed(true)} />
}
