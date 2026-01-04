import type { ReactNode } from 'react'

type LabeledContainerProps = {
  label: string
  children: ReactNode
  className?: string
}

export function LabeledContainer({
  label,
  children,
  className = '',
}: LabeledContainerProps) {
  return (
    <div className={`relative border border-border rounded ${className}`}>
      <span className="absolute top-0 -translate-y-1/2 left-2 px-1 bg-background text-xs text-muted-foreground font-mono">
        {label}
      </span>
      <div className="pt-4 pb-2 px-2 h-full flex items-center justify-center">{children}</div>
    </div>
  )
}
