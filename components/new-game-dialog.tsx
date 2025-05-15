"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"

type BoardMode = "boggle" | "random"

interface NewGameDialogProps {
  onNewGame: (mode: BoardMode) => Promise<void>
  isLoading: boolean
  currentMode: BoardMode
}

export function NewGameDialog({ onNewGame, isLoading, currentMode }: NewGameDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedMode, setSelectedMode] = useState<BoardMode>(currentMode)

  const handleGenerate = async () => {
    setOpen(false)
    await onNewGame(selectedMode)
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Generating...
              </>
            ) : (
              "New Game"
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate New Game</DialogTitle>
            <DialogDescription>Choose how you want to generate the Boggle board.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <RadioGroup
              value={selectedMode}
              onValueChange={(value) => setSelectedMode(value as BoardMode)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-2">
                <TooltipWrapper content="Uses the 16 official Boggle dice configuration for authentic gameplay">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="boggle" id="dialog-boggle" />
                    <Label htmlFor="dialog-boggle" className="cursor-pointer font-medium">
                      Authentic Boggle Dice
                    </Label>
                  </div>
                </TooltipWrapper>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Uses the 16 official Boggle dice configuration for authentic gameplay.
              </p>

              <div className="flex items-start space-x-2">
                <TooltipWrapper content="Uses weighted random letter generation for more variety">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="random" id="dialog-random" />
                    <Label htmlFor="dialog-random" className="cursor-pointer font-medium">
                      Random Letters
                    </Label>
                  </div>
                </TooltipWrapper>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Uses weighted random letter generation for more variety.
              </p>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={isLoading}>
              Generate Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
