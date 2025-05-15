// Dictionary management and loading

// We'll use a Set for fast lookups
let dictionary: Set<string> = new Set()
let isLoaded = false
let isLoading = false

// Dictionary source - this is a commonly used word list for word games
// This is the ENABLE dictionary (Enhanced North American Benchmark Lexicon)
const DICTIONARY_URL = "https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt"

export async function loadDictionary(): Promise<void> {
  if (isLoaded || isLoading) return

  isLoading = true

  try {
    const response = await fetch(DICTIONARY_URL)
    if (!response.ok) {
      throw new Error(`Failed to load dictionary: ${response.status}`)
    }

    const text = await response.text()
    const words = text.split("\n").filter((word) => word.trim().length > 0)

    // Filter words to only include those that are 3-16 letters (typical Boggle rules)
    dictionary = new Set(
      words.map((word) => word.toLowerCase().trim()).filter((word) => word.length >= 3 && word.length <= 16),
    )

    isLoaded = true
    console.log(`Dictionary loaded with ${dictionary.size} words`)
  } catch (error) {
    console.error("Error loading dictionary:", error)
    throw error
  } finally {
    isLoading = false
  }
}

export function isValidWord(word: string): boolean {
  return dictionary.has(word.toLowerCase())
}

export function getDictionarySize(): number {
  return dictionary.size
}

export function isDictionaryLoaded(): boolean {
  return isLoaded
}

export function isDictionaryLoading(): boolean {
  return isLoading
}
