import type { ReactNode, CSSProperties } from 'react'

type LabeledContainerProps = {
  label: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function LabeledContainer({
  label,
  children,
  className = '',
  style,
}: LabeledContainerProps) {
  return (
    <div className={`relative border border-border bg-background ${className}`} style={style}>
      <span className="absolute top-0 -translate-y-1/2 left-2 px-1 bg-background text-xs text-muted-foreground font-mono">
        {label}
      </span>
      <div className="pt-3 pb-1 px-1 h-full overflow-hidden">{children}</div>
    </div>
  )
}
