import { ChevronRight } from 'lucide-react'
import { formatDuration } from '../../lib/format'
import type { BreakdownGroup, BreakdownRow } from '../../lib/studyTime'

const durationOrDash = (ms: number) => ms > 0 ? formatDuration(ms) : '—'

// Projects and general study have no theory/exercise split, so their bar takes the group's own colour.
function BreakdownCells({ row, splitsByKind, accent, max }: { row: BreakdownRow; splitsByKind: boolean; accent: string; max: number }) {
  return (
    <>
      <span className="study-breakdown-value" data-label="Theory">{splitsByKind ? durationOrDash(row.theory) : '—'}</span>
      <span className="study-breakdown-value" data-label="Exercise">{splitsByKind ? durationOrDash(row.exercise) : '—'}</span>
      <span className="study-breakdown-value study-breakdown-total" data-label="Total">{durationOrDash(row.total)}</span>
      <span className="study-breakdown-bar" aria-hidden="true">
        {splitsByKind
          ? <><i className="study-accent-theory" style={{ width: `${row.theory / max * 100}%` }} /><i className="study-accent-exercise" style={{ width: `${row.exercise / max * 100}%` }} /></>
          : <i className={`study-accent-${accent}`} style={{ width: `${row.total / max * 100}%` }} />}
      </span>
    </>
  )
}

export function StudyModuleBreakdown({ groups }: { groups: BreakdownGroup[] }) {
  const max = Math.max(1, ...groups.map((group) => group.total))

  return (
    <div className="study-breakdown">
      <div className="study-breakdown-head" aria-hidden="true"><span>Module</span><span>Theory</span><span>Exercise</span><span>Total</span><span /></div>
      {groups.map((group) => {
        const accent = group.id === 'general' ? 'general' : 'project'
        return (
          <details key={group.id} className="study-breakdown-group">
            <summary className="study-breakdown-row">
              <span className="study-breakdown-label"><ChevronRight size={16} className="study-breakdown-chevron" /><span><small>{group.kicker}</small><strong>{group.label}</strong></span></span>
              <BreakdownCells row={group} splitsByKind={group.splitsByKind} accent={accent} max={max} />
            </summary>
            {group.rows.length
              ? <ul className="study-breakdown-lessons">
                {group.rows.map((row) => <li key={row.id} className="study-breakdown-row"><span className="study-breakdown-label">{row.label}</span><BreakdownCells row={row} splitsByKind={group.splitsByKind} accent={accent} max={max} /></li>)}
              </ul>
              : <p className="study-empty">No time logged in this module yet.</p>}
          </details>
        )
      })}
    </div>
  )
}
