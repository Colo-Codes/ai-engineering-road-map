import { execFile } from 'node:child_process'

// Milliseconds since the last keyboard or mouse input anywhere on this computer, or null where that can't be read.
// macOS only for now: IOHIDSystem reports HIDIdleTime in nanoseconds.
export function readSystemIdleMs(): Promise<number | null> {
  if (process.platform !== 'darwin') return Promise.resolve(null)
  return new Promise((resolve) => {
    execFile('ioreg', ['-c', 'IOHIDSystem', '-d', '4'], { timeout: 3000, maxBuffer: 8 * 1024 * 1024 }, (error, stdout) => {
      const match = error ? null : stdout.match(/"HIDIdleTime" = (\d+)/)
      resolve(match ? Number(match[1]) / 1e6 : null)
    })
  })
}

export type AwayPeriod = { sessionId: string; from: string; to: string }
export type IdleStatus = { supported: boolean | null; away: AwayPeriod | null }

type IdleWatchOptions = {
  // The running study session, if any; watching only happens while one runs.
  runningSessionId: () => string | null
  thresholdMs: number
  sampleMs: number
  // Where idle time comes from; replaceable so the logic can be exercised without real input.
  readIdleMs?: () => Promise<number | null>
}

// Samples system idle time on the server, where browser tab throttling can't delay it, and records one away period
// (from the last input before going idle to the first input after coming back) for the page to offer to discard.
export function createIdleWatch({ runningSessionId, thresholdMs, sampleMs, readIdleMs = readSystemIdleMs }: IdleWatchOptions) {
  let supported: boolean | null = null
  let watchedSessionId: string | null = null
  let awaySince: number | null = null
  let away: AwayPeriod | null = null
  let lastSample = Date.now()
  let sampling = false

  const reset = (sessionId: string | null) => {
    watchedSessionId = sessionId
    awaySince = null
    away = null
  }

  const sample = async () => {
    if (sampling) return
    sampling = true
    try {
      const sessionId = runningSessionId()
      const now = Date.now()
      // A sample far later than scheduled means the computer was asleep for the gap.
      const gap = now - lastSample
      lastSample = now
      if (sessionId !== watchedSessionId) reset(sessionId)
      if (!sessionId) return

      const idleMs = await readIdleMs()
      // Measured after the read, so the time the read takes doesn't skew "last input".
      const readAt = Date.now()
      supported = idleMs !== null
      // One unanswered away period at a time; a later one is ignored rather than merged, so active time is never discarded.
      if (away) return
      const lastInput = idleMs === null ? null : readAt - idleMs

      if (awaySince === null) {
        if (gap >= thresholdMs) awaySince = now - gap
        else if (lastInput !== null && idleMs !== null && idleMs >= thresholdMs) awaySince = lastInput
      }
      if (awaySince === null) return

      // Back once there's input clearly after going away (more than one sample later, to ignore measuring jitter);
      // without idle data, as soon as the computer is awake again.
      const backAt = lastInput === null ? readAt : lastInput > awaySince + sampleMs ? lastInput : null
      if (backAt === null) return
      if (backAt - awaySince >= thresholdMs) away = { sessionId, from: new Date(awaySince).toISOString(), to: new Date(backAt).toISOString() }
      awaySince = null
    } finally {
      sampling = false
    }
  }

  const timer = setInterval(() => { void sample() }, sampleMs)
  timer.unref()

  return {
    status: (): IdleStatus => ({ supported, away: away && away.sessionId === runningSessionId() ? away : null }),
    // Called once the away period has been kept or discarded.
    dismiss: () => { away = null },
    close: () => clearInterval(timer),
  }
}
