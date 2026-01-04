import { LabeledContainer } from './LabeledContainer'
import { ItemTile } from './ItemTile'
import type { GroupedDirectory } from '../../lib/directory'

const CARD_SIZE = 64 // px
const GRID_COLS = 15
const BOX_PADDING_X = 16 // px (px-2 each side)
const BOX_PADDING_Y = 24 // px (pt-4 + pb-2)

type GroupBox = {
  group: GroupedDirectory
  x: number      // grid column start
  y: number      // grid row start
  cols: number   // width in grid cells
  rows: number   // height in grid cells
  itemCols: number // how many item columns fit
}

// Calculate optimal box dimensions for a group's item count
function optimalBox(itemCount: number, maxGridCols: number): { gridCols: number; gridRows: number; itemCols: number } {
  // Calculate usable space per grid cell accounting for padding
  // We need: itemCols * CARD_SIZE + BOX_PADDING_X <= gridCols * CARD_SIZE
  // So: itemCols <= gridCols - BOX_PADDING_X/CARD_SIZE

  let bestGridCols = 1
  let bestGridRows = itemCount + 1
  let bestItemCols = 1
  let bestScore = Infinity

  for (let gridCols = 1; gridCols <= maxGridCols; gridCols++) {
    // How many items fit horizontally in this box width
    const usableWidth = gridCols * CARD_SIZE - BOX_PADDING_X
    const itemCols = Math.max(1, Math.floor(usableWidth / CARD_SIZE))
    const itemRows = Math.ceil(itemCount / itemCols)

    // How many grid rows needed for these item rows
    const neededHeight = itemRows * CARD_SIZE + BOX_PADDING_Y
    const gridRows = Math.ceil(neededHeight / CARD_SIZE)

    // Score: prefer wider boxes (closer to 16:9)
    const ratio = gridCols / gridRows
    const score = Math.abs(ratio - 2) + gridCols * gridRows * 0.01 // prefer wider, smaller total area

    if (score < bestScore) {
      bestScore = score
      bestGridCols = gridCols
      bestGridRows = gridRows
      bestItemCols = itemCols
    }
  }

  return { gridCols: bestGridCols, gridRows: bestGridRows, itemCols: bestItemCols }
}

// Simple row-based packing into GRID_COLS wide
function packIntoGrid(data: GroupedDirectory[]): GroupBox[] {
  const boxes: GroupBox[] = []
  let cursorX = 0
  let cursorY = 0
  let rowHeight = 0

  for (const group of data) {
    const remainingCols = GRID_COLS - cursorX
    const { gridCols, gridRows, itemCols } = optimalBox(
      group.items.length,
      Math.min(GRID_COLS, remainingCols > 2 ? remainingCols : GRID_COLS)
    )

    // Check if fits in current row
    if (cursorX + gridCols > GRID_COLS) {
      // Move to next row
      cursorX = 0
      cursorY += rowHeight
      rowHeight = 0
    }

    boxes.push({
      group,
      x: cursorX,
      y: cursorY,
      cols: gridCols,
      rows: gridRows,
      itemCols,
    })

    cursorX += gridCols
    rowHeight = Math.max(rowHeight, gridRows)
  }

  return boxes
}

type EcosystemGridProps = {
  data: GroupedDirectory[]
}

export function EcosystemGrid({ data }: EcosystemGridProps) {
  const boxes = packIntoGrid(data)
  const totalItems = data.reduce((sum, g) => sum + g.items.length, 0)
  const maxRow = Math.max(...boxes.map(b => b.y + b.rows))

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-muted-foreground font-mono">
        {totalItems} items in {GRID_COLS}×{maxRow} grid ({(GRID_COLS / maxRow).toFixed(2)} ratio, target {(16/9).toFixed(2)})
      </div>
      <div
        className="relative"
        style={{
          width: GRID_COLS * CARD_SIZE,
          height: maxRow * CARD_SIZE,
        }}
      >
        {boxes.map(({ group, x, y, cols, rows, itemCols }) => (
          <div
            key={group.category}
            className="absolute"
            style={{
              left: x * CARD_SIZE,
              top: y * CARD_SIZE,
              width: cols * CARD_SIZE,
              height: rows * CARD_SIZE,
            }}
          >
            <LabeledContainer
              label={`${group.category} [${group.items.length}]`}
              className="w-full h-full"
            >
              <div
                className="flex flex-wrap justify-center content-center"
                style={{ width: itemCols * CARD_SIZE }}
              >
                {group.items.map((item) => (
                  <ItemTile key={item.slug} slug={item.slug} name={item.name} />
                ))}
              </div>
            </LabeledContainer>
          </div>
        ))}
      </div>
    </div>
  )
}
