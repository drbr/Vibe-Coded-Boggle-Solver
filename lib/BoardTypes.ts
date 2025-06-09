export type BoardMode = 'boggle' | 'random' | 'custom';
export type Board = string[][];
export type FoundWord = { word: string; path: number[][] };

export function boardKey(board: Board): string {
  return board.map((row) => row.join('')).join('');
}
