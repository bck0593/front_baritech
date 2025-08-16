"use client"

interface Point {
  day: string
  val: number
}

export function MiniAreaChart({ data }: { data: Point[] }) {
  const max = Math.max(...data.map((d) => d.val), 1)
  const width = 240
  const height = 60
  const step = width / (data.length - 1)
  const points = data.map((d, i) => [i * step, height - (d.val / max) * (height - 8) - 4])
  const pathD = points.reduce((acc, [x, y], i) => (i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`), "")
  const gradientId = "mini-area-grad"

  return (
    <svg width={width} height={height} role="img" aria-label="Weekly utilization trend">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={pathD} fill="none" stroke="var(--brand-blue)" strokeWidth="2" />
      {/* fill area */}
      <path
        d={`${pathD} L ${width},${height} L 0,${height} Z`}
        fill={`url(#${gradientId})`}
        stroke="none"
        opacity="0.6"
      />
    </svg>
  )
}
