// ISO → relative time using Intl.RelativeTimeFormat
export function formatRelativeTime(isoDate: string, locale = 'en'): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffSeconds = Math.round(diffMs / 1000)
  const diffMinutes = Math.round(diffSeconds / 60)
  const diffHours = Math.round(diffMinutes / 60)
  const diffDays = Math.round(diffHours / 24)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (Math.abs(diffDays) >= 1) return rtf.format(diffDays, 'day')
  if (Math.abs(diffHours) >= 1) return rtf.format(diffHours, 'hour')
  if (Math.abs(diffMinutes) >= 1) return rtf.format(diffMinutes, 'minute')
  return rtf.format(diffSeconds, 'second')
}
