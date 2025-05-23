"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import PathOverlay from "./path-overlay"

interface BoggleBoardProps {
  board: string[][]
  selectedPath: number[][]
  selectedWord: string | null
  loading?: boolean
  loadingMessage?: string
  onBoardChange?: (newBoard: string[][]) => void
  onStartEdit?: () => void
  onSaveEdit?: (board: string[][]) => void
  isEditing?: boolean
}

export default function BoggleBoard({
  board,
  selectedPath,
  selectedWord,
  loading = false,
  loadingMessage = "Finding words...",
  onBoardChange,
  onStartEdit,
  onSaveEdit,
  isEditing,
}: BoggleBoardProps) {
  const [editMode, setEditMode] = useState(false)
  const [editBoard, setEditBoard] = useState<string[][]>(board)
  const [focusPosition, setFocusPosition] = useState<[number, number] | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array(board.length)
      .fill(null)
      .map(() => Array(board[0]?.length || 0).fill(null)),
  )
  const prevEditingRef = useRef(isEditing)

  // Update editBoard when board changes (from parent)
  useEffect(() => {
    setEditBoard(board)
  }, [board])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const rows = board.length
    const cols = board[0]?.length || 0

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault()
        setFocusPosition([(rowIndex - 1 + rows) % rows, colIndex])
        break
      case "ArrowDown":
        e.preventDefault()
        setFocusPosition([(rowIndex + 1) % rows, colIndex])
        break
      case "ArrowLeft":
        e.preventDefault()
        setFocusPosition([rowIndex, (colIndex - 1 + cols) % cols])
        break
      case "ArrowRight":
        e.preventDefault()
        setFocusPosition([rowIndex, (colIndex + 1) % cols])
        break
      case "Enter":
        if (e.shiftKey) {
          // Shift+Enter to save changes
          handleSaveChanges()
        }
        break
      case "Escape":
        // Cancel edit mode
        setEditMode(false)
        setEditBoard(board)
        break
    }
  }

  // Get the next cell position (left-to-right, then top-to-bottom)
  const getNextCellPosition = (rowIndex: number, colIndex: number): [number, number] => {
    const rows = board.length
    const cols = board[0]?.length || 0

    // Move to the next column
    let nextCol = colIndex + 1
    let nextRow = rowIndex

    // If we're at the end of a row, move to the next row
    if (nextCol >= cols) {
      nextCol = 0
      nextRow = (nextRow + 1) % rows
    }

    return [nextRow, nextCol]
  }

  // Focus the input at the specified position
  useEffect(() => {
    if (focusPosition && editMode) {
      const [row, col] = focusPosition
      inputRefs.current[row]?.[col]?.focus()
    }
  }, [focusPosition, editMode])

  const handleLetterChange = (rowIndex: number, colIndex: number, value: string) => {
    // Take the last character typed (or empty string if backspace/delete was used)
    const letter = value.length > 0 ? value.toLowerCase().slice(-1) : ""

    const newBoard = editBoard.map((row, r) => row.map((cell, c) => (r === rowIndex && c === colIndex ? letter : cell)))
    setEditBoard(newBoard)

    // If a letter was entered (not deleted), advance to the next cell
    if (letter) {
      const nextPosition = getNextCellPosition(rowIndex, colIndex)
      setFocusPosition(nextPosition)
    }
  }

  const handleSaveChanges = () => {
    // Filter out any empty cells and replace with random letters
    const validBoard = editBoard.map((row) => row.map((cell) => (cell.trim() === "" ? "e" : cell)))

    setEditMode(false)
    if (onSaveEdit) {
      onSaveEdit(validBoard)
    }
  }

  const isInPath = (row: number, col: number) => {
    return selectedPath.some(([r, c]) => r === row && c === col)
  }

  const isFirstInPath = (row: number, col: number) => {
    return selectedPath.length > 0 && selectedPath[0][0] === row && selectedPath[0][1] === col
  }

  // Handle edit mode changes from parent
  useEffect(() => {
    if (isEditing !== undefined && isEditing !== prevEditingRef.current) {
      setEditMode(isEditing)

      // Only set focus to first cell when first entering edit mode
      if (isEditing && !prevEditingRef.current) {
        setFocusPosition([0, 0])
      }
      // Handle saving when exiting edit mode
      else if (!isEditing && prevEditingRef.current && onSaveEdit) {
        const validBoard = editBoard.map((row) => row.map((cell) => (cell.trim() === "" ? "e" : cell)))
        onSaveEdit(validBoard)
      }

      prevEditingRef.current = isEditing
    }
  }, [isEditing, onSaveEdit])

  // Expose a method to get the current edit board
  useEffect(() => {
    // Add the getEditBoard method to the component instance
    if (typeof window !== "undefined") {
      // @ts-ignore - Adding a custom property to the component instance
      window.boggleBoardEditState = editBoard
    }

    return () => {
      if (typeof window !== "undefined") {
        // @ts-ignore - Cleaning up
        delete window.boggleBoardEditState
      }
    }
  }, [editBoard])

  if (!board.length) return <div>Loading...</div>

  return (
    <div className="relative">
      <div className="boggle-board relative grid grid-cols-4 gap-2 aspect-square w-full max-w-md mx-auto">
        {/* Path overlay for drawing lines between cells */}
        {!editMode && (
          <PathOverlay selectedPath={selectedPath} boardSize={board.length} word={selectedWord} board={board} />
        )}

        {board.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "boggle-dice flex items-center justify-center text-2xl font-bold aspect-square relative z-10",
                editMode ? "edit-mode" : "",
                !editMode && isInPath(rowIndex, colIndex) && "selected",
                !editMode && isFirstInPath(rowIndex, colIndex) && "first-in-path",
              )}
            >
              {editMode ? (
                <input
                  ref={(el) => {
                    inputRefs.current[rowIndex][colIndex] = el
                  }}
                  type="text"
                  value={editBoard[rowIndex][colIndex]}
                  onChange={(e) => handleLetterChange(rowIndex, colIndex, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                  onFocus={(e) => e.target.select()}
                  className="w-full h-full text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-boggle-accent uppercase"
                  maxLength={1}
                  aria-label={`Letter at row ${rowIndex + 1}, column ${colIndex + 1}`}
                />
              ) : (
                letter.toUpperCase()
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
    </div>
  )
}
