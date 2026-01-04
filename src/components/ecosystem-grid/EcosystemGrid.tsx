import { ResponsiveTreeMap } from '@nivo/treemap'
import { LabeledContainer } from './LabeledContainer'
import { ItemTile } from './ItemTile'
import type { GroupedDirectory } from '../../lib/directory'

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
  const totalItems = data.reduce((sum, g) => sum + g.items.length, 0)

  // Calculate total area needed
  const totalArea = data.reduce((sum, g) => sum + calcMinArea(g.items.length), 0)

  // Size container to fit all items with 16:9 ratio
  const scale = 1.3 // extra space for treemap inefficiency
  const treeWidth = Math.ceil(Math.sqrt(totalArea * scale * (16 / 9)))
  const treeHeight = Math.ceil(treeWidth * (9 / 16))

  // Transform data for nivo treemap - use calculated area as value
  const treeData = {
    name: 'root',
    children: data.map((group) => ({
      name: group.category,
      value: calcMinArea(group.items.length),
      items: group.items,
    })),
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="text-xs text-muted-foreground font-mono">
        {totalItems} items in {treeWidth}×{treeHeight}px ({(treeWidth / treeHeight).toFixed(2)} ratio)
      </div>
      <div className="bg-background" style={{ width: treeWidth + 24, height: treeHeight + 32, paddingTop: 20, paddingLeft: 12, paddingRight: 12, paddingBottom: 12 }}>
        <ResponsiveTreeMap
          data={treeData}
          identity="name"
          value="value"
          tile="squarify"
          leavesOnly={true}
          innerPadding={12}
          outerPadding={0}
          borderWidth={0}
          colors={['transparent']}
          nodeComponent={({ node }) => {
            const items = (node.data as { items?: Array<{ slug: string; name: string }> }).items || []
            const labelHeight = 8 // space for label above border
            const padding = 4 // px-1 + border
            const availableWidth = node.width - padding * 2

            // Calculate how many items fit and actual height needed
            const itemCols = Math.max(1, Math.floor(availableWidth / CARD_SIZE))
            const itemRows = Math.ceil(items.length / itemCols)
            const contentHeight = itemRows * CARD_SIZE + 24 // pt-5 + pb-1

            // Bottom-align: offset by difference between allocated and actual height
            const topOffset = Math.max(0, node.height - contentHeight)

            return (
              <g transform={`translate(${node.x},${node.y})`}>
                <foreignObject
                  width={node.width}
                  height={node.height + labelHeight}
                  y={-labelHeight}
                  style={{ overflow: 'visible' }}
                >
                  <div style={{ marginTop: labelHeight + topOffset }}>
                    <LabeledContainer
                      label={`${node.id} [${items.length}]`}
                      style={{ width: itemCols * CARD_SIZE + padding * 2 + 2, height: contentHeight }}
                    >
                      <div
                        className="flex flex-wrap content-start"
                        style={{ width: itemCols * CARD_SIZE }}
                      >
                        {items.map((item) => (
                          <ItemTile key={item.slug} slug={item.slug} name={item.name} />
                        ))}
                      </div>
                    </LabeledContainer>
                  </div>
                </foreignObject>
              </g>
            )
          }}
        />
      </div>
    </div>
  )
}
