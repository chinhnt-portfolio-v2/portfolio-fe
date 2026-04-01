import { AI_WORKFLOW_STEPS } from '@/config/about'

interface AIWorkflowStripProps {
  className?: string
}

export function AIWorkflowStrip({ className }: AIWorkflowStripProps) {
  return (
    <div
      role="region"
      aria-label="AI-augmented development workflow"
      className={['flex flex-wrap items-start gap-x-1.5 gap-y-2', className].filter(Boolean).join(' ')}
    >
      {AI_WORKFLOW_STEPS.map((step, i) => (
        <div key={i} className="flex items-start gap-1">
          <div className="flex flex-col items-center">
            <span aria-hidden="true" className="text-xl leading-none">
              {step.icon}
            </span>
            <span
              className="mt-0.5 text-[10px] font-semibold leading-tight text-foreground"
              aria-label={`${step.label}: ${step.ariaLabel}`}
            >
              {step.label}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight text-center max-w-[64px]">
              {step.sublabel}
            </span>
          </div>
          {i < AI_WORKFLOW_STEPS.length - 1 && (
            <span aria-hidden="true" className="mx-0.5 pt-1 text-xs text-muted-foreground/40">→</span>
          )}
        </div>
      ))}
    </div>
  )
}
