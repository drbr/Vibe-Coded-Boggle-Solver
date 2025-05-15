"use client"

import { useState, useEffect } from "react"
import BoggleBoard from "@/components/boggle-board"
import WordList from "@/components/word-list"
import { findAllWords } from "@/lib/boggle-solver"
import { generateRandomBoard, generateBoggleDiceBoard } from "@/lib/board-generator"
import { loadDictionary, isDictionaryLoaded, getDictionarySize } from "@/lib/dictionary"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NewGameDialog } from "@/components/new-game-dialog"

type BoardMode = "boggle" | "random"

export default function Home() {
  const [board, setBoard] = useState<string[][]>([])
  const [words, setWords] = useState<{ word: string; path: number[][] }[]>([])
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<number[][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [gameLoading, setGameLoading] = useState(false)
  const [dictionarySize, setDictionarySize] = useState(0)
  const [boardMode, setBoardMode] = useState<BoardMode>("boggle")

  useEffect(() => {
    const initializeGame = async () => {
      setIsLoading(true)
      try {
        // Load the dictionary first
        await loadDictionary()
        setDictionarySize(getDictionarySize())

        // Then start a new game
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
    setGameLoading(true)

    try {
      if (!isDictionaryLoaded()) {
        await loadDictionary()
      }

      // Update the mode if it changed
      if (mode !== boardMode) {
        setBoardMode(mode)
      }

      // Generate a new board using either real Boggle dice or random letters
      const newBoard = mode === "boggle" ? generateBoggleDiceBoard(4, 4) : generateRandomBoard(4, 4)
      setBoard(newBoard)

      const foundWords = findAllWords(newBoard)
      setWords(foundWords)
      setSelectedWord(null)
      setSelectedPath([])

      return foundWords
    } catch (error) {
      console.error("Error generating new game:", error)
    } finally {
      setGameLoading(false)
    }
  }

  const handleWordClick = (word: string, path: number[][]) => {
    setSelectedWord(word)
    setSelectedPath(path)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Dictionary...</h2>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-2">Boggle Solver</h1>
        <p className="text-muted-foreground mb-6">
          Using {dictionarySize.toLocaleString()} words from the Scrabble dictionary
        </p>

        <div className="flex flex-col md:flex-row w-full max-w-4xl gap-8">
          <div className="w-full md:w-1/2">
            <BoggleBoard board={board} selectedPath={selectedPath} loading={gameLoading} />

            <div className="mt-4">
              <NewGameDialog onNewGame={generateNewGame} isLoading={gameLoading} currentMode={boardMode} />
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                <strong>Current mode:</strong> {boardMode === "boggle" ? "Authentic Boggle Dice" : "Random Letters"}
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <WordList words={words} selectedWord={selectedWord} onWordClick={handleWordClick} />
          </div>
        </div>
      </main>
    </TooltipProvider>
  )
}
