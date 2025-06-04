// Dictionary management and loading
import { Trie } from './trie';

// We'll use a Trie for fast lookups and prefix checking
let dictionaryTrie: Trie | null = null;
let isLoaded = false;
let isLoading = false;

export async function loadDictionary(): Promise<void> {
  if (isLoaded || isLoading) return;

  isLoading = true;
  console.time('Dictionary loading');

  try {
    // Fetch the dictionary from the public directory
    const response = await fetch('/dictionary.txt');
    if (!response.ok) {
      throw new Error(`Failed to load dictionary: ${response.status}`);
    }

    const text = await response.text();
    const words = text
      .split('\n')
      .filter((word: string) => word.trim().length > 0)
      .map((word: string) => word.toLowerCase().trim())
      .filter((word: string) => word.length >= 3 && word.length <= 16);

    console.log(`Building trie with ${words.length} words...`);
    dictionaryTrie = Trie.fromArray(words);

    isLoaded = true;
    console.log(`Dictionary loaded with ${words.length} words`);
  } catch (error) {
    console.error('Error loading dictionary:', error);
    throw error;
  } finally {
    isLoading = false;
    console.timeEnd('Dictionary loading');
  }
}

export function isValidWord(word: string): boolean {
  if (!dictionaryTrie) return false;
  return dictionaryTrie.search(word.toLowerCase());
}

export function hasWordWithPrefix(prefix: string): boolean {
  if (!dictionaryTrie) return false;
  return dictionaryTrie.startsWith(prefix.toLowerCase());
}

export function getDictionarySize(): number {
  // Approximate size of the local ENABLE dictionary
  return 172823; // Based on the actual line count of our dictionary.txt file
}

export function isDictionaryLoaded(): boolean {
  return isLoaded;
}

export function isDictionaryLoading(): boolean {
  return isLoading;
}
