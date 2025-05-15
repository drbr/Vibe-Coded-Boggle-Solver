import { isValidWord } from "./dictionary"

// Define directions for traversal (horizontal, vertical, diagonal)
const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

// Find all valid words on the board using the dictionary
export function findAllWords(board: string[][]): { word: string; path: number[][] }[] {
  const rows = board.length
  const cols = board[0].length
  const results: { word: string; path: number[][] }[] = []
  const visited = Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(false))

  // Generate words starting from each cell
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dfs(board, i, j, "", [], visited, results)
    }
  }

  return results
}

// Depth-first search to find all possible words
function dfs(
  board: string[][],
  row: number,
  col: number,
  currentWord: string,
  currentPath: number[][],
  visited: boolean[][],
  results: { word: string; path: number[][] }[],
) {
  // Check boundaries
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length || visited[row][col]) {
    return
  }

  // Add current letter to the word
  const newWord = currentWord + board[row][col]
  const newPath = [...currentPath, [row, col]]

  // Mark as visited
  visited[row][col] = true

  // If word is valid according to the dictionary, add it to results
  if (newWord.length >= 3 && isValidWord(newWord)) {
    // Avoid duplicates
    if (!results.some((item) => item.word === newWord)) {
      results.push({ word: newWord, path: newPath })
    }
  }

  // Continue searching in all directions
  for (const [dx, dy] of directions) {
    dfs(board, row + dx, col + dy, newWord, newPath, visited, results)
  }

  // Backtrack
  visited[row][col] = false
}
