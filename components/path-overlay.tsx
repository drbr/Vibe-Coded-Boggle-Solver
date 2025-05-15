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

  // Validate and reorder the path to match the word if needed
  const orderedPath = [...selectedPath]

  // Generate path segments between consecutive cells
  const pathSegments = []

  for (let i = 0; i < orderedPath.length - 1; i++) {
    const [currentRow, currentCol] = orderedPath[i]
    const [nextRow, nextCol] = orderedPath[i + 1]

    const start = getCellCenter(currentRow, currentCol)
    const end = getCellCenter(nextRow, nextCol)

    // Calculate the direction vector
    const dx = end.x - start.x
    const dy = end.y - start.y
    const length = Math.sqrt(dx * dx + dy * dy)

    // Normalize the direction vector
    const nx = dx / length
    const ny = dy / length

    // Shorten the line significantly to avoid covering the letters
    const shortenFactor = 14
    const adjustedStart = {
      x: start.x + nx * shortenFactor,
      y: start.y + ny * shortenFactor,
    }

    const adjustedEnd = {
      x: end.x - nx * shortenFactor,
      y: end.y - ny * shortenFactor,
    }

    pathSegments.push({ start: adjustedStart, end: adjustedEnd })
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
            className="fill-[#4a6fa5]"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>

        {pathSegments.map((segment, index) => (
          <line
            key={index}
            x1={`${segment.start.x}%`}
            y1={`${segment.start.y}%`}
            x2={`${segment.end.x}%`}
            y2={`${segment.end.y}%`}
            className="stroke-[#4a6fa5] stroke-[2.5px]"
            markerEnd="url(#arrowhead)"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  )
}
