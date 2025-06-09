'use client';

import { useState, useEffect, useReducer } from 'react';
import { LoadedGame } from '@/components/LoadedGame';
import { loadDictionary } from '@/lib/dictionary';
import { Trie } from '@/lib/trie';
import { generateNewBoard } from '../lib/generateNewBoard';
import { Board, boardKey, BoardMode } from '@/lib/BoardTypes';

type LoadingState =
  | { name: 'loadingDictionary' }
  | {
      name: 'loadedDictionary';
      dictionary: Trie;
      board: Board;
      mode: BoardMode;
    }
  | { name: 'error' };

type LoadingAction =
  | {
      type: 'LOADED_DICTIONARY';
      dictionary: Trie;
      board: Board;
      mode: BoardMode;
    }
  | { type: 'ERROR' }
  | { type: 'UPDATE_BOARD'; board: Board; mode: BoardMode };

function loadingStateReducer(state: LoadingState, action: LoadingAction): LoadingState {
  switch (state.name) {
    case 'loadingDictionary':
      switch (action.type) {
        case 'LOADED_DICTIONARY':
          return {
            name: 'loadedDictionary',
            dictionary: action.dictionary,
            board: action.board,
            mode: action.mode,
          };
        case 'ERROR':
          return {
            name: 'error',
          };
        default:
          return state;
      }
    case 'loadedDictionary':
      switch (action.type) {
        case 'UPDATE_BOARD':
          return {
            name: 'loadedDictionary',
            dictionary: state.dictionary,
            board: action.board,
            mode: action.mode,
          };
        default:
          return state;
      }
    case 'error':
      return state;
  }
}

export default function Page() {
  const [loadState, dispatchLoadAction] = useReducer(loadingStateReducer, {
    name: 'loadingDictionary',
  });

  // Load dictionary
  useEffect(() => {
    const doLoadDictionary = async () => {
      try {
        const dictionary = await loadDictionary();
        const mode: BoardMode = 'boggle';
        const board = generateNewBoard(mode);
        dispatchLoadAction({
          type: 'LOADED_DICTIONARY',
          dictionary,
          board,
          mode,
        });
      } catch (error) {
        console.error('Failed to initialize game:', error);
        dispatchLoadAction({ type: 'ERROR' });
      }
    };

    doLoadDictionary();
  }, []);

  const handleBoardChange = (newBoard: Board, mode: BoardMode) => {
    dispatchLoadAction({ type: 'UPDATE_BOARD', board: newBoard, mode });
  };

  if (loadState.name === 'loadingDictionary') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9f5eb]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-boggle-accent">Loading dictionary…</h2>
          <div className="w-16 h-16 border-4 border-boggle-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (loadState.name === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9f5eb]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-boggle-accent">Failed to load dictionary!</h2>
        </div>
      </div>
    );
  }

  const { dictionary, board, mode } = loadState;
  return (
    <main className="flex h-screen flex-col items-center p-4 md:p-8 bg-[#f9f5eb]">
      <h1 className="boggle-title text-4xl font-bold mb-2">BOGGLE SOLVER</h1>
      <p className="text-muted-foreground mb-6">
        Using {dictionary.size.toLocaleString()} words from the Scrabble dictionary
      </p>
      <LoadedGame
        // Mount a new board component whenever the letters change. In particular, this prevents the
        // game from staying in edit mode if you choose "new game" while editing.
        key={boardKey(board)}
        boardMode={mode}
        board={board}
        dictionary={dictionary}
        handleBoardChange={handleBoardChange}
      />
    </main>
  );
}
