'use client';
import {
  generateBoggleDiceBoard,
  generateRandomBoard,
} from '@/lib/board-generator';
import { withTiming } from '@/lib/utils';
import { BoardMode, Board } from './BoardTypes';

export function generateNewBoard(mode: BoardMode): Board {
  return withTiming('Board generation', () => {
    const newBoard =
      mode === 'boggle'
        ? generateBoggleDiceBoard(4, 4)
        : generateRandomBoard(4, 4);
    return newBoard;
  });
}
