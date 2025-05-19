"use client"

import { useState, useEffect, useRef } from "react"
import BoggleBoard from "@/components/boggle-board"
import WordList from "@/components/word-list"
import { findAllWords } from "@/lib/boggle-solver"
import { generateRandomBoard, generateBoggleDiceBoard } from "@/lib/board-generator"
import { loadDictionary, isDictionaryLoaded, getDictionarySize } from "@/lib/dictionary"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NewGameDialog } from "@/components/new-game-dialog"
import { Button } from "@/components/ui/button"
import { Edit, Check } from "lucide-react"

type BoardMode = "boggle" | "random"

export default function Home() {
  const [board, setBoard] = useState<string[][]>([])
  const [words, setWords] = useState<{ word: string; path: number[][] }[]>([])
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<number[][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [gameLoading, setGameLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Loading...")
  const [dictionarySize, setDictionarySize] = useState(0)
  const [boardMode, setBoardMode] = useState<BoardMode>("boggle")
  const [isEditing, setIsEditing] = useState(false)
  const boggleBoardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initializeGame = async () => {
      setIsLoading(true)
      setLoadingMessage("Loading dictionary...")
      try {
        // Load the dictionary first
        console.log("Loading dictionary...")
        await loadDictionary()
        setDictionarySize(getDictionarySize())

        // Then start a new game
        setLoadingMessage("Generating initial game...")
        console.log("Generating initial game...")
        await generateNewGame(boardMode)
      } catch (error) {
        console.error("Failed to initialize game:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeGame()
  }, [])

  const generateNewGame = async (mode: BoardMode) => {
    console.log(`Generating new game with mode: ${mode}`)
    setGameLoading(true)

    try {
      if (!isDictionaryLoaded()) {
        setLoadingMessage("Loading dictionary...")
        await loadDictionary()
      }

      // Update the mode if it changed
      if (mode !== boardMode) {
        setBoardMode(mode)
      }

      // Generate a new board using either real Boggle dice or random letters
      setLoadingMessage("Generating board...")
      console.time("Board generation")
      const newBoard = mode === "boggle" ? generateBoggleDiceBoard(4, 4) : generateRandomBoard(4, 4)
      console.timeEnd("Board generation")
      setBoard(newBoard)

      // Find all words on the board
      setLoadingMessage("Finding words...")
      console.log("Finding words on the board...")
      const foundWords = findAllWords(newBoard)
      setWords(foundWords)
      setSelectedWord(null)
      setSelectedPath([])

      return foundWords
    } catch (error) {
      console.error("Error generating new game:", error)
      throw error
    } finally {
      setGameLoading(false)
    }
  }

  const handleBoardChange = async (newBoard: string[][]) => {
    setGameLoading(true)
    setLoadingMessage("Finding words...")

    try {
      // Update the board
      setBoard(newBoard)

      // Find all words on the new board
      const foundWords = findAllWords(newBoard)
      setWords(foundWords)
      setSelectedWord(null)
      setSelectedPath([])
    } catch (error) {
      console.error("Error updating board:", error)
    } finally {
      setGameLoading(false)
    }
  }

  const handleWordClick = (word: string, path: number[][]) => {
    // Verify that the path matches the word
    const verifiedPath = verifyWordPath(word, path, board)
    setSelectedWord(word)
    setSelectedPath(verifiedPath)
  }

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = (newBoard: string[][]) => {
    setIsEditing(false)
    handleBoardChange(newBoard)
  }

  const handleEditButtonClick = () => {
    if (isEditing) {
      // When saving, get the current edit state from the window object
      // @ts-ignore - Accessing custom property
      const currentEditBoard = window.boggleBoardEditState
      if (currentEditBoard) {
        // Validate the board (replace empty cells with 'e')
        const validBoard = currentEditBoard.map((row: string[]) =>
          row.map((cell: string) => (cell.trim() === "" ? "e" : cell)),
        )
        handleSaveEdit(validBoard)
      } else {
        // Fallback if we can't get the edit state
        setIsEditing(false)
      }
    } else {
      handleStartEdit()
    }
  }

  // Function to verify and fix the path if needed
  const verifyWordPath = (word: string, path: number[][], board: string[][]) => {
    // Check if the path matches the word
    const pathWord = path.map(([row, col]) => board[row][col]).join("")

    // If the path already spells the word correctly, return it as is
    if (pathWord === word) {
      return path
    }

    // If the path spells the word in reverse, reverse the path
    if (pathWord.split("").reverse().join("") === word) {
      return [...path].reverse()
    }

    // Otherwise, we need to reconstruct the path
    // This is a fallback and shouldn't normally be needed
    console.warn("Path does not match word, attempting to reconstruct")

    // For now, just return the original path
    // In a real implementation, we would need to reconstruct the path
    return path
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9f5eb]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-boggle-accent">{loadingMessage}</h2>
          <div className="w-16 h-16 border-4 border-boggle-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-[#f9f5eb]">
        <h1 className="boggle-title text-4xl font-bold mb-2">BOGGLE SOLVER</h1>
        <p className="text-muted-foreground mb-6">
          Using {dictionarySize.toLocaleString()} words from the Scrabble dictionary
        </p>

        <div className="flex flex-col md:flex-row w-full max-w-4xl gap-8">
          <div className="w-full md:w-1/2 md:sticky md:top-8 md:self-start">
            <div ref={boggleBoardRef}>
              <BoggleBoard
                board={board}
                selectedPath={selectedPath}
                selectedWord={selectedWord}
                loading={gameLoading}
                loadingMessage={loadingMessage}
                onBoardChange={handleBoardChange}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                isEditing={isEditing}
              />
            </div>

            <div className="mt-4">
              <Button
                className="w-full bg-boggle-secondary hover:bg-boggle-secondary/90 font-semibold"
                onClick={handleEditButtonClick}
                disabled={gameLoading}
              >
                {isEditing ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    SAVE LETTERS
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    EDIT LETTERS
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4">
              <NewGameDialog
                key={`dialog-${gameLoading}`}
                onNewGame={generateNewGame}
                isLoading={gameLoading}
                currentMode={boardMode}
              />
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                <strong>Current mode:</strong> {boardMode === "boggle" ? "Authentic Boggle Dice" : "Random Letters"}
              </p>
              <p className="mt-1">
                <strong>Tip:</strong> Click "Edit Letters" to customize the board. Use arrow keys to navigate and Enter
                to save.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto">
            <WordList words={words} selectedWord={selectedWord} onWordClick={handleWordClick} />
          </div>
        </div>
      </main>
    </TooltipProvider>
  )
}
