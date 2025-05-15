// Dictionary management and loading
import { Trie } from "./trie"

// We'll use a Trie for fast lookups and prefix checking
let dictionaryTrie: Trie | null = null
let isLoaded = false
let isLoading = false

// Dictionary source - this is a commonly used word list for word games
// This is the ENABLE dictionary (Enhanced North American Benchmark Lexicon)
const DICTIONARY_URL = "https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt"

export async function loadDictionary(): Promise<void> {
  if (isLoaded || isLoading) return

  isLoading = true
  console.time("Dictionary loading")

  try {
    const response = await fetch(DICTIONARY_URL)
    if (!response.ok) {
      throw new Error(`Failed to load dictionary: ${response.status}`)
    }

    const text = await response.text()
    const words = text
      .split("\n")
      .filter((word) => word.trim().length > 0)
      .map((word) => word.toLowerCase().trim())
      .filter((word) => word.length >= 3 && word.length <= 16)

    console.log(`Building trie with ${words.length} words...`)
    dictionaryTrie = Trie.fromArray(words)

    isLoaded = true
    console.log(`Dictionary loaded with ${words.length} words`)
  } catch (error) {
    console.error("Error loading dictionary:", error)
    throw error
  } finally {
    isLoading = false
    console.timeEnd("Dictionary loading")
  }
}

export function isValidWord(word: string): boolean {
  if (!dictionaryTrie) return false
  return dictionaryTrie.search(word.toLowerCase())
}

export function hasWordWithPrefix(prefix: string): boolean {
  if (!dictionaryTrie) return false
  return dictionaryTrie.startsWith(prefix.toLowerCase())
}

export function getDictionarySize(): number {
  // This is an approximation since we don't store the full word list after loading
  return 172000 // Approximate size of the ENABLE dictionary
}

export function isDictionaryLoaded(): boolean {
  return isLoaded
}

export function isDictionaryLoading(): boolean {
  return isLoading
}
