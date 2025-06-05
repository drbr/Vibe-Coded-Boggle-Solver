/**
 * Trie data structure for efficient word lookups and prefix checking
 */
export class Trie {
  private root: TrieNode;
  private size_: number;

  /**
   * Construct a trie from an array of words. If we want the trie to be case-insensitive, then
   * the words should already be normalized (e.g. converted to lowercase).
   */
  public constructor(words: string[]) {
    this.root = new TrieNode();
    this.size_ = words.length;

    for (const word of words) {
      this.insert(word);
    }
  }

  /** Inserts a word into the trie */
  private insert(word: string): void {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }

  public get size(): number {
    return this.size_;
  }

  /** Check if a word exists in the trie */
  public search(word: string): boolean {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  /** Check if any word in the trie starts with the given prefix */
  public startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  /** Find the node that corresponds to the last character of the word/prefix */
  private findNode(str: string): TrieNode | null {
    let node = this.root;
    for (const char of str.toLowerCase()) {
      if (!node.children.has(char)) {
        return null;
      }
      node = node.children.get(char)!;
    }
    return node;
  }
}

/**
 * Node in the Trie
 */
class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}
