import { useState, useEffect, useCallback } from 'react'

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void
    }
  }
}
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { ProjectHoverContent } from '@/components/shared/ProjectHoverContent'
import type { DirectoryEntry } from '@/lib/directory'

type ItemTileProps = {
  entry: DirectoryEntry
  category: string
}

export function ItemTile({ entry, category }: ItemTileProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  const handleCardView = useCallback(() => {
    window.umami?.track('project_card_view', { project: entry.name, category })
  }, [entry.name, category])

  // Get first word only
  const shortName = entry.name.split(' ')[0]

  return (
    <HoverCard openDelay={200} closeDelay={100} onOpenChange={(open) => open && handleCardView()}>
      <HoverCardTrigger asChild>
        <div
          className="w-16 h-16 flex flex-col items-center justify-center gap-0.5 p-1 cursor-pointer"
          title={entry.name}
        >
          <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
            <img
              src={`/assets/logos/normalized/${entry.slug}-light.svg`}
              alt={entry.name}
              className="w-full h-full object-contain dark:hidden"
            />
            <img
              src={`/assets/logos/normalized/${entry.slug}-dark.svg`}
              alt={entry.name}
              className="w-full h-full object-contain hidden dark:block"
            />
          </div>
          <span className="text-[8px] text-muted-foreground w-full text-center leading-tight truncate mt-1">
            {shortName}
          </span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent side="top" align="center">
        <ProjectHoverContent entry={entry} category={category} isDark={isDark} />
      </HoverCardContent>
    </HoverCard>
  )
}
