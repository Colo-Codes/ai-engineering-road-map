import { useEffect, useState } from 'react'
import { useNow } from '../hooks/useNow'
import { formatClock } from '../lib/format'
import { sessionDuration } from '../lib/studyTime'
import type { StudySession } from '../types'

// Shows the running clock in the browser tab, so it stays visible from other tabs.
export function StudyDocumentTitle({ active }: { active: StudySession | null }) {
  const running = active?.status === 'running'
  const now = useNow(running)
  const [baseTitle] = useState(() => document.title)

  useEffect(() => {
    if (!active) document.title = baseTitle
    else document.title = running ? `▶ ${formatClock(sessionDuration(active, now))} · ${active.target.label}` : `❚❚ ${active.target.label}`
  }, [active, running, now, baseTitle])

  useEffect(() => () => { document.title = baseTitle }, [baseTitle])

  return null
}
