import { useEffect, useRef, useState } from 'react'

// Put the zero-height sentinel right before the sticky element; it rests at the sticky offset until scrolled past.
export function useStuck<T extends HTMLElement>(requiredScroll = 24) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<T>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    const sticky = stickyRef.current
    if (!sentinel || !sticky) return
    let stickyTop = 0
    const measure = () => { stickyTop = parseFloat(getComputedStyle(sticky).top) || 0 }
    const update = () => setStuck(sentinel.getBoundingClientRect().top <= stickyTop - requiredScroll)
    const handleResize = () => { measure(); update() }
    measure()
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', handleResize)
    }
  }, [requiredScroll])

  return { sentinelRef, stickyRef, stuck }
}
