import { cn } from '@/lib/utils'

interface FilterChipProps {
  label: string
  isActive: boolean
  onClick: () => void
  className?: string
}

export function FilterChip({ label, isActive, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
        'min-h-[44px]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2',
        isActive
          ? 'border-brand bg-brand text-white'
          : 'border-border text-muted-foreground hover:border-brand/50 hover:bg-brand/10',
        className,
      )}
    >
      {label}
    </button>
  )
}
