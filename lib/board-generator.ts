// Generate a random Boggle board with weighted letter distribution
export function generateRandomBoard(rows: number, cols: number): string[][] {
  const board: string[][] = []

  // English letter frequency (roughly)
  const letterFrequency = {
    a: 8.2,
    b: 1.5,
    c: 2.8,
    d: 4.3,
    e: 12.7,
    f: 2.2,
    g: 2.0,
    h: 6.1,
    i: 7.0,
    j: 0.2,
    k: 0.8,
    l: 4.0,
    m: 2.4,
    n: 6.7,
    o: 7.5,
    p: 1.9,
    q: 0.1,
    r: 6.0,
    s: 6.3,
    t: 9.1,
    u: 2.8,
    v: 1.0,
    w: 2.4,
    x: 0.2,
    y: 2.0,
    z: 0.1,
  }

  // Create a weighted array of letters
  const letters: string[] = []
  for (const [letter, frequency] of Object.entries(letterFrequency)) {
    const count = Math.round(frequency * 10)
    letters.push(...Array(count).fill(letter))
  }

  // Generate the board
  for (let i = 0; i < rows; i++) {
    const row: string[] = []
    for (let j = 0; j < cols; j++) {
      const randomIndex = Math.floor(Math.random() * letters.length)
      row.push(letters[randomIndex])
    }
    board.push(row)
  }

  // Special case: ensure at least 5 vowels on the board
  const vowels = ["a", "e", "i", "o", "u"]
  let vowelCount = 0

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (vowels.includes(board[i][j])) {
        vowelCount++
      }
    }
  }

  // If we don't have enough vowels, replace some consonants
  if (vowelCount < 5) {
    const cellsToReplace = 5 - vowelCount
    const allCells = []

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!vowels.includes(board[i][j])) {
          allCells.push([i, j])
        }
      }
    }

    // Shuffle and pick cells to replace
    allCells.sort(() => Math.random() - 0.5)

    for (let i = 0; i < Math.min(cellsToReplace, allCells.length); i++) {
      const [row, col] = allCells[i]
      board[row][col] = vowels[Math.floor(Math.random() * vowels.length)]
    }
  }

  return board
}

// For a more authentic Boggle experience, we can use the actual Boggle dice
export function generateBoggleDiceBoard(rows: number, cols: number): string[][] {
  // Official Boggle dice (16 dice for a 4x4 game)
  const boggleDice = [
    ["A", "A", "E", "E", "G", "N"],
    ["A", "B", "B", "J", "O", "O"],
    ["A", "C", "H", "O", "P", "S"],
    ["A", "F", "F", "K", "P", "S"],
    ["A", "O", "O", "T", "T", "W"],
    ["C", "I", "M", "O", "T", "U"],
    ["D", "E", "I", "L", "R", "X"],
    ["D", "E", "L", "R", "V", "Y"],
    ["D", "I", "S", "T", "T", "Y"],
    ["E", "E", "G", "H", "N", "W"],
    ["E", "E", "I", "N", "S", "U"],
    ["E", "H", "R", "T", "V", "W"],
    ["E", "I", "O", "S", "S", "T"],
    ["E", "L", "R", "T", "T", "Y"],
    ["H", "I", "M", "N", "U", "Qu"],
    ["H", "L", "N", "N", "R", "Z"],
  ]

  // For boards other than 4x4, we'll need to adjust
  if (rows * cols !== 16) {
    return generateRandomBoard(rows, cols)
  }

  // Shuffle the dice
  const shuffledDice = [...boggleDice].sort(() => Math.random() - 0.5)

  // Create the board
  const board: string[][] = []
  let diceIndex = 0

  for (let i = 0; i < rows; i++) {
    const row: string[] = []
    for (let j = 0; j < cols; j++) {
      // Roll the die (pick a random face)
      const die = shuffledDice[diceIndex++]
      const faceIndex = Math.floor(Math.random() * 6)
      const letter = die[faceIndex].toLowerCase()

      // Handle the special "Qu" case
      if (letter === "qu") {
        row.push("q") // We'll handle the 'u' in the UI
      } else {
        row.push(letter)
      }
    }
    board.push(row)
  }

  return board
}
