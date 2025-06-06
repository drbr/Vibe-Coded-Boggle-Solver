'use client';

import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BoardMode } from '@/lib/BoardTypes';

interface NewGameDialogProps {
  onNewGame: (mode: BoardMode) => void;
  currentMode: BoardMode;
}

export function NewGameDialog({ onNewGame, currentMode }: NewGameDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<BoardMode>(currentMode);

  const handleGenerate = () => {
    setOpen(false);
    onNewGame(selectedMode);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
      }}>
      <DialogTrigger asChild>
        <Button className="w-full bg-boggle-accent hover:bg-boggle-accent/90 font-semibold">
          NEW GAME
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#f9f5eb] border-[#d9c9a3] z-[100]">
        <DialogHeader>
          <DialogTitle className="text-boggle-accent font-bold uppercase">
            Generate New Game
          </DialogTitle>
          <DialogDescription>Choose how you want to generate the Boggle board.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={selectedMode}
            onValueChange={(value) => setSelectedMode(value as BoardMode)}
            className="space-y-3">
            <div className="flex items-start space-x-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="boggle"
                  id="dialog-boggle"
                  className="text-boggle-accent border-boggle-accent"
                />
                <Label htmlFor="dialog-boggle" className="cursor-pointer font-medium">
                  Authentic Boggle Dice
                </Label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Uses the 16 official Boggle dice configuration for authentic gameplay.
            </p>

            <div className="flex items-start space-x-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="random"
                  id="dialog-random"
                  className="text-boggle-accent border-boggle-accent"
                />
                <Label htmlFor="dialog-random" className="cursor-pointer font-medium">
                  Random Letters
                </Label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Uses weighted random letter generation for more variety.
            </p>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-[#d9c9a3] hover:bg-[#f0e6d2] hover:text-foreground font-medium">
            CANCEL
          </Button>
          <Button
            onClick={handleGenerate}
            className="bg-boggle-accent hover:bg-boggle-accent/90 font-medium">
            GENERATE BOARD
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
