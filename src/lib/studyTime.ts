import type { CustomProject, Phase, StudyCategory, StudyInterval, StudyKind, StudySession, StudyTarget, Topic } from '../types'
import { moduleLabel, twoDigits } from './format'

export const STUDY_CATEGORIES: Array<{ id: StudyCategory; label: string }> = [
  { id: 'theory', label: 'Theory' },
  { id: 'exercise', label: 'Exercise' },
  { id: 'project', label: 'Personal project' },
  { id: 'general', label: 'General study' },
]
export const CATEGORY_LABELS = Object.fromEntries(STUDY_CATEGORIES.map(({ id, label }) => [id, label])) as Record<StudyCategory, string>
export const GENERAL_STUDY_LABEL = 'General study'

export type CategoryTotals = Record<StudyCategory, number>
const emptyTotals = (): CategoryTotals => ({ theory: 0, exercise: 0, project: 0, general: 0 })

export function lessonTarget(topic: Pick<Topic, 'id' | 'title'>, kind: StudyKind): StudyTarget {
  return { type: 'lesson', topicId: topic.id, kind, label: topic.title }
}

export function projectTarget(project: Pick<CustomProject, 'id' | 'title'>): StudyTarget {
  return { type: 'project', projectId: project.id, label: project.title }
}

export function isTargetComplete(target: StudyTarget) {
  if (target.type === 'lesson') return Boolean(target.topicId && target.label)
  if (target.type === 'project') return Boolean(target.projectId && target.label)
  return true
}

export function normaliseTarget(target: StudyTarget): StudyTarget {
  return target.type === 'general' ? { type: 'general', label: target.label.trim() || GENERAL_STUDY_LABEL } : target
}

export function studyCategory(target: StudyTarget): StudyCategory {
  return target.type === 'lesson' ? target.kind : target.type
}

export function targetKey(target: StudyTarget) {
  if (target.type === 'lesson') return `lesson:${target.topicId}:${target.kind}`
  if (target.type === 'project') return `project:${target.projectId}`
  return `general:${(target.label.trim() || GENERAL_STUDY_LABEL).toLocaleLowerCase()}`
}

export function isSameTarget(a: StudyTarget, b: StudyTarget) {
  return targetKey(a) === targetKey(b)
}

export function intervalMs({ startedAt, endedAt }: StudyInterval, now: number) {
  return Math.max(0, (endedAt ? Date.parse(endedAt) : now) - Date.parse(startedAt))
}

export function sessionDuration(session: StudySession, now: number) {
  return session.intervals.reduce((sum, interval) => sum + intervalMs(interval, now), 0)
}

export function openIntervalMs(session: StudySession, now: number) {
  const open = session.intervals.find((interval) => !interval.endedAt)
  return open ? intervalMs(open, now) : 0
}

export function sessionStart(session: StudySession) {
  return new Date(session.intervals[0]?.startedAt ?? session.createdAt)
}

// Null while the session's last interval is still open.
export function sessionEnd(session: StudySession) {
  const last = session.intervals[session.intervals.length - 1]?.endedAt
  return last ? new Date(last) : null
}

// Time already banked per target, from closed intervals only; a running clock adds its open interval itself.
export function loggedByTarget(sessions: StudySession[]) {
  const totals: Record<string, number> = {}
  sessions.forEach((session) => {
    const key = targetKey(session.target)
    session.intervals.forEach((interval) => {
      if (interval.endedAt) totals[key] = (totals[key] ?? 0) + intervalMs(interval, 0)
    })
  })
  return totals
}

export function dayKey(date: Date) {
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

// Local-day totals for a session, with intervals that cross midnight split between both days.
export function splitByDay(session: StudySession, now: number) {
  const totals = new Map<string, number>()
  session.intervals.forEach((interval) => {
    let cursor = Date.parse(interval.startedAt)
    const end = interval.endedAt ? Date.parse(interval.endedAt) : now
    while (cursor < end) {
      const sliceEnd = Math.min(end, addDays(startOfDay(new Date(cursor)), 1).getTime())
      const day = dayKey(new Date(cursor))
      totals.set(day, (totals.get(day) ?? 0) + sliceEnd - cursor)
      cursor = sliceEnd
    }
  })
  return [...totals].map(([day, ms]) => ({ day, ms }))
}

export type DayTotals = { day: string; date: Date; byCategory: CategoryTotals; total: number }

// The last `days` local days, oldest first, ending today.
export function dailyTotals(sessions: StudySession[], days: number, now: number): DayTotals[] {
  const today = startOfDay(new Date(now))
  const result = Array.from({ length: days }, (_, index) => {
    const date = addDays(today, index - days + 1)
    return { day: dayKey(date), date, byCategory: emptyTotals(), total: 0 }
  })
  const byDay = new Map(result.map((entry) => [entry.day, entry]))
  sessions.forEach((session) => {
    const category = studyCategory(session.target)
    splitByDay(session, now).forEach(({ day, ms }) => {
      const entry = byDay.get(day)
      if (!entry) return
      entry.byCategory[category] += ms
      entry.total += ms
    })
  })
  return result
}

export type StudySummary = { today: number; week: number; allTime: number; streak: number; byCategory: CategoryTotals }

// Weeks start on Monday. The streak counts consecutive days with logged time, ending today or yesterday.
export function summaryStats(sessions: StudySession[], now: number): StudySummary {
  const today = startOfDay(new Date(now))
  const todayKey = dayKey(today)
  const weekStartKey = dayKey(addDays(today, -((today.getDay() + 6) % 7)))
  const byDay = new Map<string, number>()
  const byCategory = emptyTotals()
  sessions.forEach((session) => {
    const category = studyCategory(session.target)
    splitByDay(session, now).forEach(({ day, ms }) => {
      byDay.set(day, (byDay.get(day) ?? 0) + ms)
      byCategory[category] += ms
    })
  })
  const week = [...byDay].reduce((sum, [day, ms]) => day >= weekStartKey && day <= todayKey ? sum + ms : sum, 0)
  let cursor = byDay.get(todayKey) ? today : addDays(today, -1)
  let streak = 0
  while ((byDay.get(dayKey(cursor)) ?? 0) > 0) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return { today: byDay.get(todayKey) ?? 0, week, allTime: Object.values(byCategory).reduce((sum, ms) => sum + ms, 0), streak, byCategory }
}

export type BreakdownRow = { id: string; label: string; theory: number; exercise: number; total: number }
// `splitsByKind` is false for groups whose time has no theory/exercise split (projects and general study).
export type BreakdownGroup = BreakdownRow & { kicker: string; splitsByKind: boolean; rows: BreakdownRow[] }

export function moduleBreakdown(sessions: StudySession[], phases: Phase[], now: number): BreakdownGroup[] {
  const lessons = new Map<string, BreakdownRow>()
  const projects = new Map<string, BreakdownRow>()
  const general = new Map<string, BreakdownRow>()
  const add = (rows: Map<string, BreakdownRow>, id: string, label: string, kind: StudyKind | null, ms: number) => {
    const row = rows.get(id) ?? { id, label, theory: 0, exercise: 0, total: 0 }
    if (kind) row[kind] += ms
    row.total += ms
    rows.set(id, row)
  }
  sessions.forEach((session) => {
    const { target } = session
    const ms = sessionDuration(session, now)
    if (target.type === 'lesson') add(lessons, target.topicId, target.label, target.kind, ms)
    else if (target.type === 'project') add(projects, target.projectId, target.label, null, ms)
    else add(general, targetKey(target), target.label, null, ms)
  })

  const group = (id: string, kicker: string, label: string, rows: BreakdownRow[], splitsByKind: boolean): BreakdownGroup => ({
    id, kicker, label, rows, splitsByKind,
    theory: rows.reduce((sum, row) => sum + row.theory, 0),
    exercise: rows.reduce((sum, row) => sum + row.exercise, 0),
    total: rows.reduce((sum, row) => sum + row.total, 0),
  })
  const byTotal = (a: BreakdownRow, b: BreakdownRow) => b.total - a.total
  const knownTopicIds = new Set<string>()
  const groups = phases.map((phase) => group(phase.id, moduleLabel(phase.number), phase.title, phase.topics.flatMap((topic) => {
    knownTopicIds.add(topic.id)
    const row = lessons.get(topic.id)
    return row ? [{ ...row, label: topic.title }] : []
  }), true))
  const removed = [...lessons.values()].filter((row) => !knownTopicIds.has(row.id))
  if (projects.size) groups.push(group('projects', 'Build board', 'Personal projects', [...projects.values()].sort(byTotal), false))
  if (general.size) groups.push(group('general', 'Outside the roadmap', GENERAL_STUDY_LABEL, [...general.values()].sort(byTotal), false))
  if (removed.length) groups.push(group('removed', 'Archived', 'Lessons no longer in the roadmap', removed.sort(byTotal), true))
  return groups
}

// Mirrors the server's checks so the edit dialog can explain a problem before saving.
export function validateIntervals(intervals: StudyInterval[], now: number): string | null {
  if (!intervals.length) return 'A session needs at least one interval.'
  const parsed = intervals.map(({ startedAt, endedAt }) => ({ start: Date.parse(startedAt), end: endedAt ? Date.parse(endedAt) : Number.NaN }))
  if (parsed.some(({ start, end }) => Number.isNaN(start) || Number.isNaN(end))) return 'Every interval needs a valid start and finish time.'
  if (parsed.some(({ start, end }) => end <= start)) return 'Each interval must end after it starts.'
  if (parsed.some(({ end }) => end > now)) return 'Intervals cannot end in the future.'
  const sorted = [...parsed].sort((a, b) => a.start - b.start)
  if (sorted.some(({ start }, index) => index > 0 && start < sorted[index - 1].end)) return 'Intervals cannot overlap.'
  return null
}

// <input type="datetime-local"> works in local time to the minute.
export function toDateTimeInput(iso: string) {
  const date = new Date(iso)
  return `${dayKey(date)}T${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`
}

export function fromDateTimeInput(value: string) {
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? '' : new Date(time).toISOString()
}
