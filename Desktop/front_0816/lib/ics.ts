export function createIcs(opts: {
  title: string
  startISO: string // e.g., 2025-08-20T09:30:00+09:00
  durationMin: number
  description?: string
  location?: string
}) {
  const dt = opts.startISO.replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const dtEnd = new Date(opts.startISO)
  dtEnd.setMinutes(dtEnd.getMinutes() + opts.durationMin)
  const dtEndStr = dtEnd
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "")
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DogMATEs//Walk Meetups//JP",
    "BEGIN:VEVENT",
    `DTSTART:${dt}`,
    `DTEND:${dtEndStr}`,
    `SUMMARY:${escapeText(opts.title)}`,
    opts.location ? `LOCATION:${escapeText(opts.location)}` : "",
    opts.description ? `DESCRIPTION:${escapeText(opts.description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n")

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  return url
}

function escapeText(s: string) {
  return s.replace(/\\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;")
}
