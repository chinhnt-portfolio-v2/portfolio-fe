import { cn } from '@/lib/utils'

interface EyebrowChipProps {
  children: React.ReactNode
  variant?: 'role' | 'tag'
  className?: string
}

export function EyebrowChip({ children, variant = 'role', className }: EyebrowChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
        variant === 'role' && 'border-brand/50 text-brand',
        variant === 'tag' && 'border-border text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
