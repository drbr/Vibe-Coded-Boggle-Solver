interface PathOverlayProps {
  selectedPath: number[][]
  boardSize: number
  word: string | null
  board: string[][]
}

export default function PathOverlay({ selectedPath, boardSize, word, board }: PathOverlayProps) {
  if (!selectedPath.length || !word) return null

  // Calculate cell size based on the board size (assuming square cells)
  const cellSize = 100 / boardSize // as percentage

  // Calculate the center position of a cell
  const getCellCenter = (row: number, col: number) => {
    const x = col * cellSize + cellSize / 2
    const y = row * cellSize + cellSize / 2
    return { x, y }
  }

  // Generate path segments between consecutive cells
  const pathSegments = []

  for (let i = 0; i < selectedPath.length - 1; i++) {
    const [currentRow, currentCol] = selectedPath[i]
    const [nextRow, nextCol] = selectedPath[i + 1]

    const start = getCellCenter(currentRow, currentCol)
    const end = getCellCenter(nextRow, nextCol)

    pathSegments.push({ start, end })
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <svg width="100%" height="100%" className="absolute inset-0">
        {pathSegments.map((segment, index) => (
          <line
            key={index}
            x1={`${segment.start.x}%`}
            y1={`${segment.start.y}%`}
            x2={`${segment.end.x}%`}
            y2={`${segment.end.y}%`}
            className="stroke-[#4a6fa5] stroke-[2.5px]"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  )
}
