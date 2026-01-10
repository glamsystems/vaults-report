import type { ReactNode } from 'react'

interface TableWrapperProps {
  children: ReactNode
}

export function TableWrapper({ children }: TableWrapperProps) {
  return (
    <div className="w-full max-w-full overflow-x-auto">
      {children}
    </div>
  )
}
