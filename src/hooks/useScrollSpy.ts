import { useEffect, useState } from 'react'

// Measured on scroll: IntersectionObserver crossings misreport after a jump passes several sections at once.
// A section becomes active when it reaches its own scroll-margin line, i.e. where scrollIntoView parks it.
export function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState('')
  const idsKey = sectionIds.join('|')

  useEffect(() => {
    const elements = idsKey.split('|').map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element))
    if (!elements.length) return
    // Scroll margins only change with layout (e.g. the sticky banner resizing), so they are read on resize, not per scroll.
    let lines: number[] = []
    const measure = () => { lines = elements.map((element) => (parseFloat(getComputedStyle(element).scrollMarginTop) || 0) + 2) }
    const update = () => {
      // A short final section may never reach its line before the page runs out of scroll.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setActiveId(elements[elements.length - 1].id)
        return
      }
      let current = elements[0].id
      for (const [index, element] of elements.entries()) {
        if (element.getBoundingClientRect().top > lines[index]) break
        current = element.id
      }
      setActiveId(current)
    }
    const handleResize = () => { measure(); update() }
    handleResize()
    const observer = new ResizeObserver(handleResize)
    observer.observe(document.body)
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [idsKey])

  return activeId
}
