import { useEffect } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useEscapeKey } from '../hooks/useEscapeKey'

type ModalProps = {
  className: string
  labelledBy: string
  closeLabel: string
  onClose: () => void
  style?: CSSProperties
  children: ReactNode
}

export function Modal({ className, labelledBy, closeLabel, onClose, style, children }: ModalProps) {
  useEscapeKey(onClose)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  return createPortal(
    <div className="book-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className={className} style={style} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button className="book-modal-close" onClick={onClose} aria-label={closeLabel}><X size={18} /></button>
        {children}
      </section>
    </div>,
    document.body,
  )
}
