"use client"

import { useState, useEffect } from "react"
import BoggleBoard from "@/components/boggle-board"
import WordList from "@/components/word-list"
import { findAllWords } from "@/lib/boggle-solver"
import { generateRandomBoard, generateBoggleDiceBoard } from "@/lib/board-generator"
import { loadDictionary, isDictionaryLoaded, getDictionarySize } from "@/lib/dictionary"

export default function Home() {
  const [board, setBoard] = useState<string[][]>([])
  const [words, setWords] = useState<{ word: string; path: number[][] }[]>([])
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<number[][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dictionarySize, setDictionarySize] = useState(0)
  const [useRealDice, setUseRealDice] = useState(true)

  useEffect(() => {
    const initializeGame = async () => {
      setIsLoading(true)
      try {
        // Load the dictionary first
        await loadDictionary()
        setDictionarySize(getDictionarySize())

        // Then start a new game
        await newGame()
      } catch (error) {
        console.error("Failed to initialize game:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeGame()
  }, [])

  const newGame = async () => {
    if (!isDictionaryLoaded()) {
      await loadDictionary()
    }

    // Generate a new board using either real Boggle dice or random letters
    const newBoard = useRealDice ? generateBoggleDiceBoard(4, 4) : generateRandomBoard(4, 4)
    setBoard(newBoard)

    const foundWords = findAllWords(newBoard)
    setWords(foundWords)
    setSelectedWord(null)
    setSelectedPath([])

    return foundWords
  }

  const handleWordClick = (word: string, path: number[][]) => {
    setSelectedWord(word)
    setSelectedPath(path)
  }

  const toggleDiceMode = () => {
    setUseRealDice(!useRealDice)
    newGame()
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
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-2">Boggle Solver</h1>
      <p className="text-muted-foreground mb-6">
        Using {dictionarySize.toLocaleString()} words from the Scrabble dictionary
      </p>

      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-8">
        <div className="w-full md:w-1/2">
          <BoggleBoard board={board} selectedPath={selectedPath} />
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => newGame()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              New Game
            </button>
            <button
              onClick={toggleDiceMode}
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md"
            >
              {useRealDice ? "Use Random Letters" : "Use Boggle Dice"}
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <WordList words={words} selectedWord={selectedWord} onWordClick={handleWordClick} />
        </div>
      </div>
    </main>
  )
}
