import { useEffect, useState } from 'react'

// The current time, refreshed every `intervalMs` while enabled. Only live clocks should enable it,
// so the rest of the tree doesn't re-render every second.
export function useNow(enabled: boolean, intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!enabled) return
    const tick = () => setNow(Date.now())
    // Catch up at once: the value may be stale from when the clock was last enabled.
    const first = window.setTimeout(tick, 0)
    const timer = window.setInterval(tick, intervalMs)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(timer)
    }
  }, [enabled, intervalMs])

  return now
}
