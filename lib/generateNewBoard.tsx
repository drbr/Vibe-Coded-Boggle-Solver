'use client';
import { BoardMode, Board } from '@/components/LoadedGame';
import {
  generateBoggleDiceBoard,
  generateRandomBoard,
} from '@/lib/board-generator';
import { withTiming } from '@/lib/utils';

export function generateNewBoard(mode: BoardMode): Board {
  return withTiming('Board generation', () => {
    const newBoard =
      mode === 'boggle'
        ? generateBoggleDiceBoard(4, 4)
        : generateRandomBoard(4, 4);
    return newBoard;
  });
}
