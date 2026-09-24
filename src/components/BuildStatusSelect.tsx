import type { BuildStatus } from '../types'

const OPTIONS: Array<[BuildStatus, string]> = [['to-build', 'To build'], ['in-progress', 'In progress'], ['built', 'Built']]

export function BuildStatusSelect({ value, onChange }: { value: BuildStatus; onChange: (status: BuildStatus) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as BuildStatus)}>
      {OPTIONS.map(([status, label]) => <option key={status} value={status}>{label}</option>)}
    </select>
  )
}
