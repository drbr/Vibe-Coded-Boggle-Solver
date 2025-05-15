/**
 * Trie data structure for efficient word lookups and prefix checking
 */
export class Trie {
  private root: TrieNode

  constructor() {
    this.root = new TrieNode()
  }

  // Insert a word into the trie
  insert(word: string): void {
    let node = this.root
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode())
      }
      node = node.children.get(char)!
    }
    node.isEndOfWord = true
  }

  // Check if a word exists in the trie
  search(word: string): boolean {
    const node = this.findNode(word)
    return node !== null && node.isEndOfWord
  }

  // Check if any word in the trie starts with the given prefix
  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null
  }

  // Find the node that corresponds to the last character of the word/prefix
  private findNode(str: string): TrieNode | null {
    let node = this.root
    for (const char of str.toLowerCase()) {
      if (!node.children.has(char)) {
        return null
      }
      node = node.children.get(char)!
    }
    return node
  }

  // Build a trie from an array of words
  static fromArray(words: string[]): Trie {
    const trie = new Trie()
    for (const word of words) {
      trie.insert(word)
    }
    return trie
  }
}

/**
 * Node in the Trie
 */
class TrieNode {
  children: Map<string, TrieNode>
  isEndOfWord: boolean

  constructor() {
    this.children = new Map()
    this.isEndOfWord = false
  }
}
