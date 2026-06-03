export default function ProgressBar({
  pct,
  color,
}: {
  pct: number
  color?: 'success' | 'warning' | 'danger'
}) {
  return (
    <div
      className="progress-bar-wrap"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`progress-bar-fill${color ? ` ${color}` : ''}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
