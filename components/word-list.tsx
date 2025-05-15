"use client"

import { cn } from "@/lib/utils"

interface WordListProps {
  words: { word: string; path: number[][] }[]
  selectedWord: string | null
  onWordClick: (word: string, path: number[][]) => void
}

export default function WordList({ words, selectedWord, onWordClick }: WordListProps) {
  // Group words by length for better organization
  const wordsByLength = words.reduce(
    (acc, { word, path }) => {
      const length = word.length
      if (!acc[length]) acc[length] = []
      acc[length].push({ word, path })
      return acc
    },
    {} as Record<number, { word: string; path: number[][] }[]>,
  )

  // Sort by word length (descending)
  const sortedLengths = Object.keys(wordsByLength)
    .map(Number)
    .sort((a, b) => b - a)

  if (words.length === 0) {
    return (
      <div className="flex flex-col">
        <h2 className="boggle-subtitle text-xl font-semibold mb-2">FOUND WORDS: 0</h2>
        <div className="word-list p-4 h-full flex items-center justify-center">
          <p className="text-muted-foreground text-center">No words found on this board. Try generating a new board.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <h2 className="boggle-subtitle text-xl font-semibold mb-2 sticky top-0 bg-[#f9f5eb] z-10 py-2">
        FOUND WORDS: {words.length}
      </h2>

      <div className="word-list p-4">
        {sortedLengths.map((length) => (
          <div key={length} className="mb-4">
            <h3 className="boggle-subtitle text-md font-medium text-muted-foreground mb-2">
              {length} LETTERS ({wordsByLength[length].length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {wordsByLength[length].map(({ word, path }) => (
                <button
                  key={word}
                  onClick={() => onWordClick(word, path)}
                  className={cn("word-item px-3 py-1.5 text-left", selectedWord === word ? "selected" : "")}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
