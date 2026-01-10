import { useState, useEffect, useCallback } from 'react'

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void
    }
  }
}

import { EcosystemGrid } from './ecosystem-grid'
import { MobileAccordionView } from './directory-table'
import type { GroupedDirectory } from '@/lib/directory'

interface LandingContentProps {
  data: GroupedDirectory[]
}

export function LandingContent({ data }: LandingContentProps) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') return true
    if (stored === 'light') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  const handleCardView = useCallback((project: string, category: string) => {
    window.umami?.track('project_card_view', { project, category })
  }, [])

  return (
    <div>
      {/* Mobile: Accordion view */}
      <div className="md:hidden">
        <MobileAccordionView
          data={data}
          isDark={isDark}
          onCardView={handleCardView}
        />
      </div>
      {/* Desktop: Ecosystem map */}
      <div className="hidden md:block">
        <EcosystemGrid data={data} />
      </div>
    </div>
  )
}
