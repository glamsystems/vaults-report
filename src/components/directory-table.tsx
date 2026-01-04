import { Fragment, useState, useMemo, useEffect } from 'react'
import { GithubLogo, FileText, XLogo, Globe, LinkedinLogo, EnvelopeSimple, TelegramLogo, X, Funnel, MagnifyingGlass } from '@phosphor-icons/react'
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
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'
import type { DirectoryEntry, GroupedDirectory } from '@/lib/directory'
import { useIsMobile } from '@/hooks/use-mobile'

interface DirectoryTableProps {
  data: GroupedDirectory[]
}

function ChainBadges({ chains, maxRows = 1 }: { chains: string[]; maxRows?: 1 | 2 }) {
  if (!chains.length) return <span className="text-muted-foreground">—</span>

  // 2 badges per row
  const maxVisible = maxRows * 2
  const displayChains = chains.slice(0, maxVisible)
  const remaining = chains.length - maxVisible

  return (
    <div className="flex flex-wrap gap-1">
      {displayChains.map((chain) => (
        <span
          key={chain}
          className="inline-flex items-center rounded-none bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
        >
          {chain}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-none bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          +{remaining}
        </span>
      )}
    </div>
  )
}

function LinkIcons({ entry, showAll = false }: { entry: DirectoryEntry; showAll?: boolean }) {
  const { url, github, docs, twitter, linkedin, email, telegram } = entry

  return (
    <div className="flex items-center gap-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
        title="Website"
      >
        <Globe className="size-5" />
      </a>
      {github && (
        <a
          href={`https://github.com/${github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="GitHub"
        >
          <GithubLogo className="size-5" />
        </a>
      )}
      {docs && (
        <a
          href={docs}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Documentation"
        >
          <FileText className="size-5" />
        </a>
      )}
      {twitter && (
        <a
          href={`https://x.com/${twitter}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="X/Twitter"
        >
          <XLogo className="size-5" />
        </a>
      )}
      {showAll && linkedin && (
        <a
          href={`https://linkedin.com/company/${linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="LinkedIn"
        >
          <LinkedinLogo className="size-5" />
        </a>
      )}
      {showAll && email && (
        <a
          href={`mailto:${email}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Email"
        >
          <EnvelopeSimple className="size-5" />
        </a>
      )}
      {showAll && telegram && (
        <a
          href={`https://t.me/${telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Telegram"
        >
          <TelegramLogo className="size-5" />
        </a>
      )}
    </div>
  )
}

function ProjectHoverContent({ entry, category, isDark }: { entry: DirectoryEntry; category: string; isDark: boolean }) {
  return (
    <div className="space-y-3 text-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={`${import.meta.env.BASE_URL}assets/logos/normalized/${entry.slug}-${isDark ? 'dark' : 'light'}.svg`}
          alt={entry.name}
          className="size-8"
        />
        <div>
          <p className="font-medium">{entry.name}</p>
          <p className="text-xs text-muted-foreground">
            {entry.subCategory || category}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="font-[family-name:var(--font-geist-sans)] text-muted-foreground">{entry.description}</p>

      {/* Chains */}
      <div>
        <ChainBadges chains={entry.chains} maxRows={2} />
      </div>

      {/* Links */}
      <div className="pt-1">
        <LinkIcons entry={entry} showAll />
      </div>
    </div>
  )
}

interface FilterToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  categories: string[]
  chains: string[]
  selectedCategories: string[]
  selectedChains: string[]
  onCategoryChange: (category: string) => void
  onChainChange: (chain: string) => void
  onClearAll: () => void
}

function FilterToolbar({
  search,
  onSearchChange,
  categories,
  chains,
  selectedCategories,
  selectedChains,
  onCategoryChange,
  onChainChange,
  onClearAll,
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
          className="h-8 w-48 rounded-none border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
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
    </div>
  )
}

export function DirectoryTable({ data }: DirectoryTableProps) {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [isDark, setIsDark] = useState(false)
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
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const handleChainChange = (chain: string) => {
    setSelectedChains((prev) =>
      prev.includes(chain)
        ? prev.filter((c) => c !== chain)
        : [...prev, chain]
    )
  }

  const handleClearAll = () => {
    setSearch('')
    setSelectedCategories([])
    setSelectedChains([])
  }

  return (
    <div>
      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        chains={chains}
        selectedCategories={selectedCategories}
        selectedChains={selectedChains}
        onCategoryChange={handleCategoryChange}
        onChainChange={handleChainChange}
        onClearAll={handleClearAll}
      />
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
                <TableCell colSpan={4} className="py-3">
                  <span className="font-medium">{group.category}</span>
                  <span className="text-muted-foreground ml-2">
                    [{group.items.length}]
                  </span>
                </TableCell>
              </TableRow>
              {/* Entry Rows */}
              {group.items.map((entry) => {
                const row = (
                  <TableRow
                    key={entry.slug}
                    className="cursor-pointer"
                    onClick={() => window.open(entry.url, '_blank')}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={`${import.meta.env.BASE_URL}assets/logos/normalized/${entry.slug}-${isDark ? 'dark' : 'light'}.svg`}
                          alt={entry.name}
                          className="size-6"
                        />
                        <span className="font-medium">{entry.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-[family-name:var(--font-geist-sans)] text-muted-foreground line-clamp-2 whitespace-normal max-w-md">
                        {entry.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <ChainBadges chains={entry.chains} />
                    </TableCell>
                    <TableCell>
                      <LinkIcons entry={entry} />
                    </TableCell>
                  </TableRow>
                )

                if (isMobile) {
                  return row
                }

                return (
                  <HoverCard key={entry.slug} openDelay={200} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      {row}
                    </HoverCardTrigger>
                    <HoverCardContent side="bottom" align="end" className="w-96">
                      <ProjectHoverContent entry={entry} category={group.category} isDark={isDark} />
                    </HoverCardContent>
                  </HoverCard>
                )
              })}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
