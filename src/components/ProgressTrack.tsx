export function ProgressTrack({ percent }: { percent: number }) {
  return <div className="mini-track"><span style={{ width: `${percent}%` }} /></div>
}
