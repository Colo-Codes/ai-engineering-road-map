import { useCallback, useEffect, useState } from 'react'
import { dismissIdle, loadIdleStatus } from '../api'
import type { AwayPeriod } from '../types'

const POLL_MS = 10000

// Asks the server whether an away period was recorded for the running session. The server does the watching,
// so a throttled background tab only delays when the prompt appears, not the times it offers to discard.
export function useIdlePrompt(runningSessionId: string | null) {
  const [away, setAway] = useState<AwayPeriod | null>(null)

  useEffect(() => {
    if (!runningSessionId) {
      setAway(null)
      return
    }
    let cancelled = false
    const check = () => {
      loadIdleStatus()
        .then((status) => { if (!cancelled) setAway(status.away?.sessionId === runningSessionId ? status.away : null) })
        .catch(() => undefined)
    }
    check()
    const timer = window.setInterval(check, POLL_MS)
    // Coming back to the tab is the likeliest moment to have returned from being away.
    const onVisible = () => { if (document.visibilityState === 'visible') check() }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', check)
    return () => {
      cancelled = true
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', check)
    }
  }, [runningSessionId])

  const keep = useCallback(() => {
    setAway(null)
    void dismissIdle().catch(() => undefined)
  }, [])

  return { away, keep, clear: () => setAway(null) }
}
