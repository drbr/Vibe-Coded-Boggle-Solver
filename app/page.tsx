'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { LoadedGame, Board, BoardMode } from '@/components/LoadedGame';
import { loadDictionary } from '@/lib/dictionary';
import { Trie } from '@/lib/trie';
import { generateNewBoard } from '../lib/generateNewBoard';

type LoadingState =
  | { type: 'loadingDictionary' }
  | { type: 'loadedDictionary'; dictionary: Trie; board: Board }
  | { type: 'error' };

export default function Home() {
  const [loadState, setLoadState] = useState<LoadingState>({
    type: 'loadingDictionary',
  });

  const [boardMode, setBoardMode] = useState<BoardMode>('boggle');
  // Load dictionary
  useEffect(() => {
    const doLoadDictionary = async () => {
      setLoadState({ type: 'loadingDictionary' });
      try {
        // Load the dictionary first
        const dictionary = await loadDictionary();
        const board = generateNewBoard(boardMode);
        setLoadState({ type: 'loadedDictionary', dictionary, board });
      } catch (error) {
        console.error('Failed to initialize game:', error);
        setLoadState({ type: 'error' });
      }
    };

    doLoadDictionary();
  }, []);

  const handleBoardChange = (newBoard: Board) => {
    setLoadState({ type: 'loadedDictionary', dictionary, board: newBoard });
  };

  if (loadState.type === 'loadingDictionary') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9f5eb]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-boggle-accent">
            Loading dictionary…
          </h2>
          <div className="w-16 h-16 border-4 border-boggle-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (loadState.type === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9f5eb]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-boggle-accent">
            Failed to load dictionary!
          </h2>
        </div>
      </div>
    );
  }

  const { dictionary, board } = loadState;
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-[#f9f5eb]">
      <h1 className="boggle-title text-4xl font-bold mb-2">BOGGLE SOLVER</h1>
      <p className="text-muted-foreground mb-6">
        Using {dictionary.size.toLocaleString()} words from the Scrabble
        dictionary
      </p>
      <LoadedGame
        boardMode={boardMode}
        board={board}
        dictionary={dictionary}
        handleBoardChange={handleBoardChange}
      />
    </main>
  );
}
