import { useState, useMemo } from 'react'
import { ArrowSquareOut, MagnifyingGlass, Funnel, X } from '@phosphor-icons/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'
import type { Resource } from '@/lib/resources'

interface ResourcesTableProps {
  data: Resource[]
}

interface FilterToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (category: string) => void
  sources: string[]
  selectedSources: string[]
  onSourceChange: (source: string) => void
  onClearAll: () => void
}

function FilterToolbar({
  search,
  onSearchChange,
  categories,
  selectedCategories,
  onCategoryChange,
  sources,
  selectedSources,
  onSourceChange,
  onClearAll,
}: FilterToolbarProps) {
  const hasFilters = selectedCategories.length > 0 || selectedSources.length > 0 || search.length > 0

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
          <MenubarTrigger>Sources</MenubarTrigger>
          <MenubarContent>
            {sources.map((source) => (
              <MenubarCheckboxItem
                key={source}
                checked={selectedSources.includes(source)}
                onCheckedChange={() => onSourceChange(source)}
              >
                {source}
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
      {selectedSources.map((source) => (
        <span
          key={`src-${source}`}
          className="inline-flex items-center gap-1 rounded-none bg-muted px-2 py-1 text-xs"
        >
          {source}
          <button
            onClick={() => onSourceChange(source)}
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

export function ResourcesTable({ data }: ResourcesTableProps) {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])

  // Extract unique categories and sources
  const { categories, sources } = useMemo(() => {
    const categoriesSet = new Set<string>()
    const sourcesSet = new Set<string>()
    data.forEach((resource) => {
      if (resource.category) categoriesSet.add(resource.category)
      if (resource.source) sourcesSet.add(resource.source)
    })
    return {
      categories: Array.from(categoriesSet).sort(),
      sources: Array.from(sourcesSet).sort(),
    }
  }, [data])

  // Filter data based on search, categories, and sources
  const filteredData = useMemo(() => {
    return data.filter((resource) => {
      const matchesSearch =
        search === '' ||
        resource.name.toLowerCase().includes(search.toLowerCase()) ||
        resource.description.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(resource.category)

      const matchesSource =
        selectedSources.length === 0 ||
        selectedSources.includes(resource.source)

      return matchesSearch && matchesCategory && matchesSource
    })
  }, [data, search, selectedCategories, selectedSources])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const handleSourceChange = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    )
  }

  const handleClearAll = () => {
    setSearch('')
    setSelectedCategories([])
    setSelectedSources([])
  }

  return (
    <div>
      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        sources={sources}
        selectedSources={selectedSources}
        onSourceChange={handleSourceChange}
        onClearAll={handleClearAll}
      />
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[280px]">Resource</TableHead>
            <TableHead className="min-w-[300px]">Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((resource) => (
            <TableRow
              key={resource.url}
              className="cursor-pointer"
              onClick={() => window.open(resource.url, '_blank')}
            >
              <TableCell className="max-w-[280px]">
                <span className="font-medium truncate block" title={resource.name}>
                  {resource.name}
                </span>
              </TableCell>
              <TableCell>
                <p className="font-[family-name:var(--font-geist-sans)] text-muted-foreground line-clamp-2 whitespace-normal max-w-md">
                  {resource.description}
                </p>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-none bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                  {resource.category}
                </span>
              </TableCell>
              <TableCell>
                {resource.date && (
                  <span className="text-muted-foreground">{resource.date}</span>
                )}
              </TableCell>
              <TableCell>
                <ArrowSquareOut className="size-5 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
