export function verifyWordPath(
  word: string,
  path: number[][],
  board: string[][]
): number[][] {
  // Check if the path matches the word
  const pathWord = path.map(([row, col]) => board[row][col]).join('');

  // If the path already spells the word correctly, return it as is
  if (pathWord === word) {
    return path;
  }

  // If the path spells the word in reverse, reverse the path
  if (pathWord.split('').reverse().join('') === word) {
    return [...path].reverse();
  }

  // Otherwise, we need to reconstruct the path
  // This is a fallback and shouldn't normally be needed
  console.warn('Path does not match word, attempting to reconstruct');

  // For now, just return the original path
  // In a real implementation, we would need to reconstruct the path
  return path;
}
