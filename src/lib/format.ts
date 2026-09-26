export function twoDigits(value: number) {
  return String(value).padStart(2, '0')
}

export function moduleLabel(number: number) {
  return `Module ${twoDigits(number)}`
}

export function lessonLabel(index: number) {
  return `Lesson ${twoDigits(index + 1)}`
}

// "1 chapter", "3 chapters"
export function pluralize(count: number, singular: string, pluralForm = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

// Logged time: "0 min", "< 1 min", "45 min", "1 h 05 min".
export function formatDuration(ms: number) {
  if (ms <= 0) return '0 min'
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return '< 1 min'
  const hours = Math.floor(minutes / 60)
  return hours ? `${hours} h ${twoDigits(minutes % 60)} min` : `${minutes} min`
}

// A running clock: "42:07", "1:02:15".
export function formatClock(ms: number) {
  const seconds = Math.floor(Math.max(0, ms) / 1000)
  const hours = Math.floor(seconds / 3600)
  const clock = `${twoDigits(Math.floor(seconds / 60) % 60)}:${twoDigits(seconds % 60)}`
  return hours ? `${hours}:${clock}` : clock
}

export function formatTimeOfDay(date: Date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// "Saturday 26 September"
export function formatDayHeading(date: Date) {
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function resourceHost(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return url }
}
