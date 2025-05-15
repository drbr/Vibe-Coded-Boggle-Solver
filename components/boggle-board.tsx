import { cn } from "@/lib/utils"
import PathOverlay from "./path-overlay"

interface BoggleBoardProps {
  board: string[][]
  selectedPath: number[][]
  selectedWord: string | null
  loading?: boolean
  loadingMessage?: string
}

export default function BoggleBoard({
  board,
  selectedPath,
  selectedWord,
  loading = false,
  loadingMessage = "Finding words...",
}: BoggleBoardProps) {
  const isInPath = (row: number, col: number) => {
    return selectedPath.some(([r, c]) => r === row && c === col)
  }

  const isFirstInPath = (row: number, col: number) => {
    return selectedPath.length > 0 && selectedPath[0][0] === row && selectedPath[0][1] === col
  }

  const getPathIndex = (row: number, col: number) => {
    return selectedPath.findIndex(([r, c]) => r === row && c === col)
  }

  if (!board.length) return <div>Loading...</div>

  return (
    <div className="boggle-board relative grid grid-cols-4 gap-2 aspect-square w-full max-w-md mx-auto">
      {/* Path overlay for drawing lines between cells */}
      <PathOverlay selectedPath={selectedPath} boardSize={board.length} word={selectedWord} board={board} />

      {board.map((row, rowIndex) =>
        row.map((letter, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "boggle-dice flex items-center justify-center text-2xl font-bold aspect-square relative z-10",
              isInPath(rowIndex, colIndex) && "selected",
              isFirstInPath(rowIndex, colIndex) && "first-in-path",
            )}
          >
            {letter.toUpperCase()}

            {isInPath(rowIndex, colIndex) && (
              <span className="path-number absolute top-1 right-1 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {getPathIndex(rowIndex, colIndex) + 1}
              </span>
            )}
          </div>
        )),
      )}

      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-lg">
          <div className="w-12 h-12 border-4 border-boggle-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-boggle-accent font-medium">{loadingMessage}</p>
        </div>
      )}
    </div>
  )
}
