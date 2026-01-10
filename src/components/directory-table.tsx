import { Fragment, useState, useMemo, useEffect, useCallback } from 'react'

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void
    }
  }
}
import { X, Funnel, MagnifyingGlass } from '@phosphor-icons/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { ChainBadges, LinkIcons, ProjectHoverContent } from '@/components/shared/ProjectHoverContent'
import { ThemedLogo } from '@/components/shared/ThemedLogo'
import type { DirectoryEntry, GroupedDirectory } from '@/lib/directory'
import { useIsMobile } from '@/hooks/use-mobile'

interface DirectoryTableProps {
  data: GroupedDirectory[]
}

interface FilterToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  onSearchBlur: () => void
  categories: string[]
  chains: string[]
  selectedCategories: string[]
  selectedChains: string[]
  onCategoryChange: (category: string) => void
  onChainChange: (chain: string) => void
  onClearAll: () => void
  isMobile: boolean
}

function FilterToolbar({
  search,
  onSearchChange,
  onSearchBlur,
  categories,
  chains,
  selectedCategories,
  selectedChains,
  onCategoryChange,
  onChainChange,
  onClearAll,
  isMobile,
}: FilterToolbarProps) {
  const hasFilters = selectedCategories.length > 0 || selectedChains.length > 0 || search.length > 0

  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <div className="relative">
        <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onBlur={onSearchBlur}
          className="h-8 w-48 rounded-none border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      {!isMobile && (
        <>
          <Funnel className="size-4 text-muted-foreground" />
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Categories</MenubarTrigger>
              <MenubarContent>
                {categories.map((category) => (
                  <MenubarCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onCategoryChange(category)}
                  >
                    {category}
                  </MenubarCheckboxItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Chains</MenubarTrigger>
              <MenubarContent className="max-h-64 overflow-y-auto">
                {chains.map((chain) => (
                  <MenubarCheckboxItem
                    key={chain}
                    checked={selectedChains.includes(chain)}
                    onCheckedChange={() => onChainChange(chain)}
                  >
                    {chain}
                  </MenubarCheckboxItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          {/* Selected filter badges */}
          {selectedCategories.map((category) => (
            <span
              key={`cat-${category}`}
              className="inline-flex items-center gap-1 rounded-none bg-muted px-2 py-1 text-xs"
            >
              {category}
              <button
                onClick={() => onCategoryChange(category)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          {selectedChains.map((chain) => (
            <span
              key={`chain-${chain}`}
              className="inline-flex items-center gap-1 rounded-none bg-muted px-2 py-1 text-xs"
            >
              {chain}
              <button
                onClick={() => onChainChange(chain)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}

          {/* Clear all button */}
          {hasFilters && (
            <button
              onClick={onClearAll}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
              Clear all
            </button>
          )}
        </>
      )}
    </div>
  )
}

interface MobileAccordionViewProps {
  data: GroupedDirectory[]
  isDark: boolean
  onCardView: (project: string, category: string) => void
}

function MobileAccordionView({ data, isDark, onCardView }: MobileAccordionViewProps) {
  return (
    <div className="space-y-6">
      {data.map((group) => (
        <div key={group.category}>
          <div className="py-2 px-1 text-sm text-muted-foreground bg-muted/50">
            {group.category}
            <span className="ml-2">[{group.items.length}]</span>
          </div>

          <Accordion type="single" collapsible>
            {group.items.map((entry) => (
              <AccordionItem key={entry.slug} value={entry.slug}>
                <AccordionTrigger
                  className="py-3 text-sm overflow-hidden"
                  onClick={() => onCardView(entry.name, group.category)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                    <ThemedLogo slug={entry.slug} name={entry.name} isDark={isDark} className="size-6 shrink-0" />
                    <span className="font-medium font-[family-name:var(--font-geist-sans)] truncate">{entry.name}</span>
                    {entry.subCategory && (
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 shrink-0 whitespace-nowrap mr-2">
                        {entry.subCategory === 'Private Credit & Alternatives' ? 'Priv. Credit & Alts' : entry.subCategory}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-1 pb-4">
                  <div className="space-y-3">
                    <p className="text-muted-foreground font-[family-name:var(--font-geist-sans)] leading-relaxed">{entry.description}</p>
                    <ChainBadges chains={entry.chains} maxRows={2} />
                    <LinkIcons entry={entry} showAll />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  )
}

export function DirectoryTable({ data }: DirectoryTableProps) {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    // Mirror Layout.astro logic
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') return true
    if (stored === 'light') return false
    // System preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const isMobile = useIsMobile()

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  // Extract unique categories and chains
  const { categories, chains } = useMemo(() => {
    const categoriesSet = new Set<string>()
    const chainsSet = new Set<string>()

    data.forEach((group) => {
      categoriesSet.add(group.category)
      group.items.forEach((item) => {
        item.chains.forEach((chain) => chainsSet.add(chain))
      })
    })

    return {
      categories: Array.from(categoriesSet),
      chains: Array.from(chainsSet).sort(),
    }
  }, [data])

  // Filter data based on search and selections
  const filteredData = useMemo(() => {
    const searchLower = search.toLowerCase()
    return data
      .filter((group) =>
        selectedCategories.length === 0 || selectedCategories.includes(group.category)
      )
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const matchesSearch =
            search === '' ||
            item.name.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower)

          const matchesChains =
            selectedChains.length === 0 ||
            item.chains.some((chain) => selectedChains.includes(chain))

          return matchesSearch && matchesChains
        }),
      }))
      .filter((group) => group.items.length > 0)
  }, [data, search, selectedCategories, selectedChains])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      const isAdding = !prev.includes(category)
      if (isAdding) {
        window.umami?.track('filter_applied', { type: 'category', value: category })
      }
      return isAdding ? [...prev, category] : prev.filter((c) => c !== category)
    })
  }

  const handleChainChange = (chain: string) => {
    setSelectedChains((prev) => {
      const isAdding = !prev.includes(chain)
      if (isAdding) {
        window.umami?.track('filter_applied', { type: 'chain', value: chain })
      }
      return isAdding ? [...prev, chain] : prev.filter((c) => c !== chain)
    })
  }

  const handleCardView = useCallback((project: string, category: string) => {
    window.umami?.track('project_card_view', { project, category })
  }, [])

  const handleClearAll = () => {
    setSearch('')
    setSelectedCategories([])
    setSelectedChains([])
  }

  const handleSearchBlur = useCallback(() => {
    if (search.trim()) {
      window.umami?.track('search_used', { page: 'directory' })
    }
  }, [search])

  return (
    <div>
      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        onSearchBlur={handleSearchBlur}
        categories={categories}
        chains={chains}
        selectedCategories={selectedCategories}
        selectedChains={selectedChains}
        onCategoryChange={handleCategoryChange}
        onChainChange={handleChainChange}
        onClearAll={handleClearAll}
        isMobile={isMobile}
      />
      {/* Mobile: Accordion view */}
      <div className="md:hidden">
        <MobileAccordionView
          data={filteredData}
          isDark={isDark}
          onCardView={handleCardView}
        />
      </div>
      {/* Desktop: Table view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Project</TableHead>
              <TableHead className="min-w-[300px]">Description</TableHead>
              <TableHead>Chains</TableHead>
              <TableHead>Links</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((group) => (
              <Fragment key={group.category}>
                {/* Category Header Row */}
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableCell className="py-3 !bg-muted/50">
                    <span className="font-normal">{group.category}</span>
                    <span className="text-muted-foreground ml-2">
                      [{group.items.length}]
                    </span>
                  </TableCell>
                  <TableCell className="bg-muted/50" />
                  <TableCell className="bg-muted/50" />
                  <TableCell className="bg-muted/50" />
                </TableRow>
                {/* Entry Rows */}
                {group.items.map((entry) => (
                  <HoverCard
                    key={entry.slug}
                    openDelay={200}
                    closeDelay={100}
                    onOpenChange={(open) => open && handleCardView(entry.name, group.category)}
                  >
                    <HoverCardTrigger asChild>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ThemedLogo slug={entry.slug} name={entry.name} isDark={isDark} className="size-6" />
                            <span className="font-medium font-[family-name:var(--font-geist-sans)]">{entry.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-[family-name:var(--font-geist-sans)] text-muted-foreground line-clamp-2 whitespace-normal max-w-md">
                            {entry.description}
                          </p>
                        </TableCell>
                        <TableCell>
                          <ChainBadges chains={entry.chains} maxVisible={2} />
                        </TableCell>
                        <TableCell>
                          <LinkIcons entry={entry} />
                        </TableCell>
                      </TableRow>
                    </HoverCardTrigger>
                    <HoverCardContent side="bottom" align="end" className="w-96">
                      <ProjectHoverContent entry={entry} category={group.category} isDark={isDark} />
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
