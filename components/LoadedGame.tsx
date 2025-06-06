import { findAllWords } from '@/lib/boggle-solver';
import { Trie } from '@/lib/trie';
import { withTiming } from '@/lib/utils';
import { Check, Edit } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import BoggleBoard from './boggle-board';
import { NewGameDialog } from './new-game-dialog';
import { Button } from './ui/button';
import WordList from './word-list';
import { generateNewBoard } from '@/lib/generateNewBoard';
import { BoardMode, Board, FoundWord } from '@/lib/BoardTypes';

export type LoadedGameProps = {
  boardMode: BoardMode;
  board: Board;
  dictionary: Trie;
  handleBoardChange: (newBoard: Board, mode: BoardMode) => void;
};

export function LoadedGame(props: LoadedGameProps) {
  const { boardMode, board, dictionary, handleBoardChange } = props;

  const boggleBoardRef = useRef<HTMLDivElement>(null);

  // Derive the found words from the board and the dictionary
  const foundWords = useMemo(() => {
    return findAllWordsOnBoard(board, dictionary);
  }, [board, dictionary]);

  const [selectedWordAndPath, setSelectedWordAndPath] = useState<{
    word: string;
    path: number[][];
  } | null>(null);

  // Whenever the words updates, the selection state needs to be cleared.
  // This relationship could be codified even more by putting the selection state
  // in a subcomponent and rendering it with a new key every time the word list changes
  // (perhaps represented by the concatenation of letters in the board).
  useEffect(() => {
    setSelectedWordAndPath(null);
  }, [foundWords]);

  const handleWordClick = (foundWord: FoundWord) => {
    setSelectedWordAndPath(foundWord);
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveEdit = (newBoard: string[][]) => {
    setIsEditing(false);
    handleBoardChange(newBoard, boardMode);
  };

  const handleEditButtonClick = () => {
    if (isEditing) {
      // When saving, get the current edit state from the window object
      // @ts-ignore - Accessing custom property
      const currentEditBoard = window.boggleBoardEditState;
      if (currentEditBoard) {
        // Validate the board (replace empty cells with 'e')
        const validBoard = currentEditBoard.map((row: string[]) =>
          row.map((cell: string) => (cell.trim() === '' ? 'e' : cell))
        );
        handleSaveEdit(validBoard);
      } else {
        // Fallback if we can't get the edit state
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const onNewGame = (mode: BoardMode) => {
    const newBoard = generateNewBoard(mode);
    handleBoardChange(newBoard, mode);
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-4xl gap-8">
      <div className="w-full md:w-1/2 md:sticky md:top-8 md:self-start">
        <div ref={boggleBoardRef}>
          <BoggleBoard
            board={board}
            selectedWordAndPath={selectedWordAndPath}
            loading={false} // TODO: Maybe get rid of this prop?
            loadingMessage={''} // TODO: Maybe get rid of this prop?
            onSaveEdit={handleSaveEdit}
            isEditing={isEditing}
          />
        </div>

        <div className="mt-4">
          <Button
            className="w-full bg-boggle-secondary hover:bg-boggle-secondary/90 font-semibold"
            onClick={handleEditButtonClick}
            disabled={false /* TODO: Maybe get rid of this prop? */}>
            {isEditing ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                SAVE LETTERS
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                EDIT LETTERS
              </>
            )}
          </Button>
        </div>

        <div className="mt-4">
          <NewGameDialog onNewGame={onNewGame} isLoading={false} currentMode={boardMode} />
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            <strong>Current mode:</strong>{' '}
            {boardMode === 'boggle' ? 'Authentic Boggle Dice' : 'Random Letters'}
          </p>
          <p className="mt-1">
            <strong>Tip:</strong> Click "Edit Letters" to customize the board. Use arrow keys to
            navigate and Enter to save.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto">
        <WordList
          words={foundWords}
          selectedWord={selectedWordAndPath?.word ?? null}
          onWordClick={handleWordClick}
        />
      </div>
    </div>
  );
}

function findAllWordsOnBoard(board: Board, dictionary: Trie): FoundWord[] {
  return withTiming('Find all words', () => {
    return findAllWords(board, dictionary);
  });
}
