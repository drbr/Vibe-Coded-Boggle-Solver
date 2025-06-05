// Dictionary management and loading
import { Trie } from './trie';

// We'll use a Trie for fast lookups and prefix checking
let dictionaryPromise: Promise<Trie> | null = null;

let isLoaded = false;
let isLoading = false;

/**
 * The dictionary is a singleton. This function is "memoized" in that it will
 * invoke the async fetch the first time it's called; all subsequent calls will
 * return the same promise as the first invocation, which resolves to the dictionary trie.
 *
 * In a more polished implementation, I'd separate the memoization from the actual business logic.
 * The only difference in the code is that it wouldn't set the global variable from within the
 * function.
 */
export async function loadDictionary(): Promise<Trie> {
  if (dictionaryPromise) return dictionaryPromise;

  dictionaryPromise = new Promise(async (resolve, reject) => {
    try {
      // The dictionary lives in the "public" directory.
      const response = await fetch('/dictionary_ospd.txt');
      if (!response.ok) {
        throw new Error(`Failed to load dictionary: ${response.status}`);
      }

      const text = await response.text();
      const words = text
        .split('\n')
        .map((word) => word.toLowerCase().trim())
        .filter((word) => word.length >= 3 && word.length <= 16);

      const dictionaryTrie = Trie.fromArray(words);
      resolve(dictionaryTrie);
    } catch (error) {
      console.error('Error loading dictionary:', error);
      reject(error);
    }
  });
  return dictionaryPromise;
}

export function isValidWord(word: string, trie: Trie): boolean {
  return trie.search(word.toLowerCase());
}

export function hasWordWithPrefix(prefix: string, trie: Trie): boolean {
  return trie.startsWith(prefix.toLowerCase());
}
