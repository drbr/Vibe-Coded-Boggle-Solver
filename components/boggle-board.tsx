import { cn } from "@/lib/utils"

interface BoggleBoardProps {
  board: string[][]
  selectedPath: number[][]
  loading?: boolean
}

export default function BoggleBoard({ board, selectedPath, loading = false }: BoggleBoardProps) {
  const isInPath = (row: number, col: number) => {
    return selectedPath.some(([r, c]) => r === row && c === col)
  }

  const getPathIndex = (row: number, col: number) => {
    return selectedPath.findIndex(([r, c]) => r === row && c === col)
  }

  if (!board.length) return <div>Loading...</div>

  return (
    <div className="relative grid grid-cols-4 gap-2 aspect-square w-full max-w-md mx-auto">
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-primary font-medium">Finding words...</p>
          </div>
        </div>
      )}

      {board.map((row, rowIndex) =>
        row.map((letter, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "flex items-center justify-center rounded-lg text-2xl font-bold aspect-square border-2",
              isInPath(rowIndex, colIndex)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-card-foreground border-border",
            )}
          >
            <div className="relative">
              {letter.toUpperCase()}
              {isInPath(rowIndex, colIndex) && (
                <span className="absolute -top-3 -right-3 bg-secondary text-secondary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
