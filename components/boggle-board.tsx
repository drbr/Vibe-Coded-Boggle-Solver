import { cn } from "@/lib/utils"

interface BoggleBoardProps {
  board: string[][]
  selectedPath: number[][]
  loading?: boolean
  loadingMessage?: string
}

export default function BoggleBoard({
  board,
  selectedPath,
  loading = false,
  loadingMessage = "Finding words...",
}: BoggleBoardProps) {
  const isInPath = (row: number, col: number) => {
    return selectedPath.some(([r, c]) => r === row && c === col)
  }

  const getPathIndex = (row: number, col: number) => {
    return selectedPath.findIndex(([r, c]) => r === row && c === col)
  }

  if (!board.length) return <div>Loading...</div>

  return (
    <div className="boggle-board relative grid grid-cols-4 gap-2 aspect-square w-full max-w-md mx-auto">
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
          <div className="w-12 h-12 border-4 border-boggle-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-boggle-accent font-medium">{loadingMessage}</p>
        </div>
      )}

      {board.map((row, rowIndex) =>
        row.map((letter, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "boggle-dice flex items-center justify-center text-2xl font-bold aspect-square",
              isInPath(rowIndex, colIndex) && "selected",
            )}
          >
            <div className="relative">
              {letter.toUpperCase()}
              {isInPath(rowIndex, colIndex) && (
                <span className="path-number absolute -top-3 -right-3 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getPathIndex(rowIndex, colIndex) + 1}
                </span>
              )}
            </div>
          </div>
        )),
      )}
    </div>
  )
}
