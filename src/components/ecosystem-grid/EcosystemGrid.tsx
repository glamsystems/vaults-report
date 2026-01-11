import { useRef, useState, useEffect, useMemo } from 'react'

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number>) => void
    }
  }
}
import { ResponsiveTreeMap } from '@nivo/treemap'
import { LabeledContainer } from './LabeledContainer'
import { ItemTile } from './ItemTile'
import { Toolbar, type ExportFormat } from './Toolbar'
import { DevToolbar, type TileMode } from './DevToolbar'
import type { DirectoryEntry, GroupedDirectory } from '../../lib/directory'

// Create a dummy entry for testing
function createDummyEntry(category: string, index: number): DirectoryEntry {
  return {
    name: `Dummy ${index + 1}`,
    slug: `dummy-${category.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    url: '#',
    description: 'Test item for layout debugging',
    category,
    subCategory: '',
    chains: [],
    status: 'active',
    listed: true,
    github: '',
    docs: '',
    twitter: '',
    linkedin: '',
    email: '',
    telegram: '',
  }
}

const CARD_SIZE = 64 // px
const BOX_PADDING = 20 // padding inside box for label + margins
const MIN_COLS = 2 // minimum columns per group

// Calculate minimum area needed to display all items in a group
function calcMinArea(itemCount: number): number {
  // Find optimal rectangle dimensions for items
  // Prefer wider rectangles (ratio ~2:1)
  let bestCols = MIN_COLS
  let bestRows = Math.ceil(itemCount / MIN_COLS)
  let bestRatio = bestCols / bestRows

  for (let cols = MIN_COLS; cols <= itemCount; cols++) {
    const rows = Math.ceil(itemCount / cols)
    const ratio = cols / rows
    // Prefer ratio around 2:1 (wider than tall)
    if (Math.abs(ratio - 2) < Math.abs(bestRatio - 2)) {
      bestCols = cols
      bestRows = rows
      bestRatio = ratio
    }
  }

  const width = bestCols * CARD_SIZE + BOX_PADDING
  const height = bestRows * CARD_SIZE + BOX_PADDING
  return width * height
}

type EcosystemGridProps = {
  data: GroupedDirectory[]
}

export function EcosystemGrid({ data }: EcosystemGridProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(false)

  // Dev toolbar state
  const [tileMode, setTileMode] = useState<TileMode>('binary')
  const [categoryDeltas, setCategoryDeltas] = useState<Record<string, number>>({})
  const [scale, setScale] = useState(1.5)
  const [innerPadding, setInnerPadding] = useState(12)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  // Create modified data with dummy items based on deltas
  const modifiedData = useMemo(() => {
    return data.map((group) => {
      const delta = categoryDeltas[group.category] || 0
      if (delta === 0) return group
      if (delta > 0) {
        // Add dummy items
        const dummies = Array.from({ length: delta }, (_, i) =>
          createDummyEntry(group.category, i)
        )
        return { ...group, items: [...group.items, ...dummies] }
      } else {
        // Remove items (from end, but keep at least 0)
        const newLength = Math.max(0, group.items.length + delta)
        return { ...group, items: group.items.slice(0, newLength) }
      }
    }).filter(group => group.items.length > 0) // Remove empty groups
  }, [data, categoryDeltas])

  const handleCountChange = (categoryName: string, delta: number) => {
    setCategoryDeltas((prev) => ({
      ...prev,
      [categoryName]: (prev[categoryName] || 0) + delta,
    }))
  }

  // Category info for dev toolbar
  const categoryInfo = data.map((group) => ({
    name: group.category,
    originalCount: group.items.length,
    count: group.items.length + (categoryDeltas[group.category] || 0),
  }))

  const generateExportCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!mapRef.current) return null

    // Fixed 16:9 canvas at 4K (3840x2160) for 2x quality
    const EXPORT_WIDTH = 3840
    const EXPORT_HEIGHT = 2160
    const HEADER_HEIGHT = 120
    const FOOTER_HEIGHT = 80
    const PADDING = 40

    // Get actual on-screen element dimensions
    const elementRect = mapRef.current.getBoundingClientRect()
    const elementWidth = elementRect.width
    const elementHeight = elementRect.height

    // Calculate available area for chart
    const availableWidth = EXPORT_WIDTH - PADDING * 2
    const availableHeight = EXPORT_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - PADDING * 2

    // Scale to fit both dimensions (proper aspect ratio preservation)
    const chartScale = Math.min(
      availableWidth / elementWidth,
      availableHeight / elementHeight
    )
    const chartWidth = Math.floor(elementWidth * chartScale)
    const chartHeight = Math.floor(elementHeight * chartScale)

    // Center the chart
    const offsetX = Math.floor((EXPORT_WIDTH - chartWidth) / 2)
    const offsetY = HEADER_HEIGHT + PADDING + Math.floor((availableHeight - chartHeight) / 2) + 40

    // Create canvas - fixed 16:9
    const canvas = document.createElement('canvas')
    canvas.width = EXPORT_WIDTH
    canvas.height = EXPORT_HEIGHT
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Background - use theme colors
    ctx.fillStyle = isDark ? '#29271f' : '#f0efeb'
    ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)

    // Hex colors to temporarily replace CSS variables (using theme colors)
    const hexColors = isDark
      ? { background: '#29271f', border: '#4f4a3c', foreground: '#f0efeb', mutedForeground: '#b7af9f' }
      : { background: '#f0efeb', border: '#d3cec3', foreground: '#29271f', mutedForeground: '#655e4b' }

    // Store original CSS variable values
    const root = document.documentElement
    const style = root.style
    const originalVars: Record<string, string> = {}
    const varsToOverride = ['--background', '--foreground', '--border', '--muted-foreground']

    // Save originals and override with hex colors
    varsToOverride.forEach(v => {
      originalVars[v] = style.getPropertyValue(v)
    })
    style.setProperty('--background', hexColors.background)
    style.setProperty('--foreground', hexColors.foreground)
    style.setProperty('--border', hexColors.border)
    style.setProperty('--muted-foreground', hexColors.mutedForeground)

    // Capture the actual on-screen element (guaranteed identical layout!)
    const html2canvas = (await import('html2canvas')).default
    const chartCanvas = await html2canvas(mapRef.current, {
      backgroundColor: hexColors.background,
      scale: 2, // Higher quality capture
      useCORS: true,
      allowTaint: true,
      onclone: async (clonedDoc) => {
        // html2canvas has trouble with SVG images - convert to data URIs
        const images = clonedDoc.querySelectorAll('img')
        await Promise.all(Array.from(images).map(async (img) => {
          try {
            const response = await fetch(img.src)
            const svgText = await response.text()
            const dataUri = `data:image/svg+xml;base64,${btoa(svgText)}`
            img.src = dataUri
          } catch (e) {
            console.warn('Failed to convert image:', img.src)
          }
        }))
      }
    })

    // Restore original CSS variables
    varsToOverride.forEach(v => {
      if (originalVars[v]) {
        style.setProperty(v, originalVars[v])
      } else {
        style.removeProperty(v)
      }
    })

    // Draw captured chart onto export canvas
    ctx.drawImage(chartCanvas, offsetX, offsetY, chartWidth, chartHeight)

    // Header (drawn after chart so it appears on top)
    const year = new Date().getFullYear()
    ctx.fillStyle = isDark ? '#f0efeb' : '#29271f'
    ctx.textBaseline = 'alphabetic'
    const headerY = PADDING * 4 // baseline position

    // Left: title
    ctx.font = '300 100px ui-monospace, monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`Vault Ecosystem ${year}`, PADDING * 2, headerY)

    // Right: "Vaults_Report" with accent underscore, stacked with "by GLAM *.+" below
    const rightEdge = EXPORT_WIDTH - PADDING * 2

    // Measure widths for Vaults_Report
    ctx.font = '58px ui-monospace, monospace'
    const vaultsWidth = ctx.measureText('Vaults').width
    const underscoreWidth = ctx.measureText('_').width
    const reportWidth = ctx.measureText('Report').width
    const vaultsReportTotal = vaultsWidth + underscoreWidth + reportWidth

    // Draw "Vaults_Report" right-aligned (draw from left to right, starting at calculated position)
    let vaultX = rightEdge - vaultsReportTotal

    ctx.fillStyle = isDark ? '#f0efeb' : '#29271f'
    ctx.fillText('Vaults', vaultX, headerY)
    vaultX += vaultsWidth

    ctx.fillStyle = isDark ? '#8fcb4d' : '#578d23' // accent green (theme primary)
    ctx.fillText('_', vaultX, headerY)
    vaultX += underscoreWidth

    ctx.fillStyle = isDark ? '#f0efeb' : '#29271f'
    ctx.fillText('Report', vaultX, headerY)

    // Draw "by GLAM *.+" right-aligned below
    ctx.font = '35px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillStyle = isDark ? 'rgba(183, 175, 159, 0.9)' : 'rgba(101, 94, 75, 0.9)'
    ctx.fillText('by GLAM *.+', rightEdge, headerY + 55)

    // Footer
    const footerY = EXPORT_HEIGHT - PADDING * 1.5
    ctx.font = '38px system-ui, -apple-system, sans-serif'
    ctx.textBaseline = 'bottom'

    // All footer text same muted color at 50% opacity
    ctx.fillStyle = isDark ? 'rgba(183, 175, 159, 0.5)' : 'rgba(101, 94, 75, 0.5)'

    // Left: copyright
    ctx.textAlign = 'left'
    ctx.fillText('© 2026 Vaults Report', PADDING * 2, footerY)

    // Right: twitter | url
    ctx.textAlign = 'right'
    ctx.fillText('@vaultsreport  |  vaults.report', EXPORT_WIDTH - PADDING * 2, footerY)

    return canvas
  }

  const handleExport = async (format: ExportFormat) => {
    const canvas = await generateExportCanvas()
    if (!canvas) return

    window.umami?.track('map_download', { format })

    const year = new Date().getFullYear()
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
    const quality = format === 'jpeg' ? 0.95 : undefined
    const dataUrl = canvas.toDataURL(mimeType, quality)

    const link = document.createElement('a')
    link.download = `vault-ecosystem-${year}.${format}`
    link.href = dataUrl
    link.click()
  }

  const getImageBlob = async (): Promise<Blob | null> => {
    const canvas = await generateExportCanvas()
    if (!canvas) return null

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png')
    })
  }

  // Calculate total area using ORIGINAL data for stable box sizes
  const totalArea = data.reduce((sum, g) => sum + calcMinArea(g.items.length), 0)

  // Size container to fit all items with 16:9 ratio
  const treeWidth = Math.ceil(Math.sqrt(totalArea * scale * (16 / 9)))
  const treeHeight = Math.ceil(treeWidth * (9 / 16))

  // Calculate global card size - find the category that needs the smallest cards
  // This ensures uniform logo sizing across all categories
  const globalCardSize = useMemo(() => {
    let minSize = CARD_SIZE // Start with default 64

    for (const group of modifiedData) {
      const originalGroup = data.find((g) => g.category === group.category)
      const originalCount = originalGroup?.items.length || group.items.length

      if (group.items.length > originalCount) {
        const ratio = Math.sqrt(originalCount / group.items.length)
        const neededSize = Math.floor(CARD_SIZE * ratio)
        minSize = Math.min(minSize, neededSize)
      }
    }

    return Math.max(32, minSize) // Min 32px
  }, [data, modifiedData])

  // Transform data for nivo treemap
  // Use original counts for area (stable sizing), but modified items for rendering
  const treeData = {
    name: 'root',
    children: modifiedData.map((group) => {
      const originalGroup = data.find((g) => g.category === group.category)
      const originalCount = originalGroup?.items.length || group.items.length
      return {
        name: group.category,
        value: calcMinArea(originalCount), // Stable area based on original count
        items: group.items, // Actual items to render (may include dummies)
        originalCount,
      }
    }),
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <div ref={mapRef} className="bg-background flex items-start justify-center"
      // style={{ width: treeWidth + 48, minHeight: treeHeight + 48, padding: 24, overflow: 'visible' }}
      >
        <div
          className="w-full h-full"
          style={{ width: treeWidth, height: treeHeight }}
        >

        <ResponsiveTreeMap
          data={treeData}
          identity="name"
          value="value"
          tile={tileMode}
          leavesOnly={true}
          innerPadding={innerPadding}
          outerPadding={12}
          borderWidth={0}
          colors={['transparent']}
          nodeComponent={({ node }) => {
            const nodeData = node.data as { items?: DirectoryEntry[]; originalCount?: number }
            const items = nodeData.items || []
            const labelHeight = 8 // space for label above border
            const padding = 4 // px-1 + border
            const availableWidth = node.width - padding * 2

            // Use global card size for uniform sizing across all categories
            const cardSize = globalCardSize

            // Calculate how many items fit and actual height needed
            const itemCols = Math.max(1, Math.floor(availableWidth / cardSize))
            const itemRows = Math.ceil(items.length / itemCols)
            const contentHeight = itemRows * cardSize + 24 // pt-5 + pb-1

            return (
              <foreignObject
                width={node.width}
                height={contentHeight + labelHeight}
                x={node.x}
                y={Math.min(node.y, 252)}
              >
                <div style={{ marginTop: labelHeight }}>
                  <LabeledContainer
                    label={`${node.id} [${items.length}]`}
                    // style={{ width: itemCols * cardSize + padding * 2 + 2, height: contentHeight }}
                  >
                    <div
                      className="flex flex-wrap content-start"
                      // style={{ width: itemCols * cardSize }}
                    >
                      {items.map((item) => (
                        <ItemTile key={item.slug} entry={item} category={node.id as string} size={cardSize} />
                      ))}
                    </div>
                  </LabeledContainer>
                </div>
              </foreignObject>
            )
          }}
        />
        </div>
      </div>
      <div className="flex justify-end mt-12 w-full" style={{ width: treeWidth-24 }}>
        <Toolbar onExport={handleExport} />
      </div>
      <DevToolbar
        tileMode={tileMode}
        onTileModeChange={setTileMode}
        categories={categoryInfo}
        onCountChange={handleCountChange}
        scale={scale}
        onScaleChange={setScale}
        innerPadding={innerPadding}
        onInnerPaddingChange={setInnerPadding}
      />
    </div>
  )
}
