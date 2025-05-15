"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
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

type BoardMode = "boggle" | "random"

interface NewGameDialogProps {
  onNewGame: (mode: BoardMode) => Promise<void>
  isLoading: boolean
  currentMode: BoardMode
}

export function NewGameDialog({ onNewGame, isLoading, currentMode }: NewGameDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedMode, setSelectedMode] = useState<BoardMode>(currentMode)
  const [dialogLoading, setDialogLoading] = useState(false)

  const handleGenerate = async () => {
    try {
      setDialogLoading(true)
      setOpen(false)
      await onNewGame(selectedMode)
    } catch (error) {
      console.error("Error generating new game:", error)
    } finally {
      setDialogLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (isLoading || dialogLoading) return // Prevent closing during loading
        setOpen(newOpen)
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full bg-boggle-accent hover:bg-boggle-accent/90 font-semibold"
          disabled={isLoading || dialogLoading}
        >
          {isLoading || dialogLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              GENERATING...
            </>
          ) : (
            "NEW GAME"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#f9f5eb] border-[#d9c9a3]">
        <DialogHeader>
          <DialogTitle className="text-boggle-accent font-bold uppercase">Generate New Game</DialogTitle>
          <DialogDescription>Choose how you want to generate the Boggle board.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={selectedMode}
            onValueChange={(value) => setSelectedMode(value as BoardMode)}
            className="space-y-3"
          >
            <div className="flex items-start space-x-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boggle" id="dialog-boggle" className="text-boggle-accent border-boggle-accent" />
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
                <RadioGroupItem value="random" id="dialog-random" className="text-boggle-accent border-boggle-accent" />
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
            disabled={dialogLoading}
            className="border-[#d9c9a3] hover:bg-[#f0e6d2] hover:text-foreground font-medium"
          >
            CANCEL
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={dialogLoading}
            className="bg-boggle-accent hover:bg-boggle-accent/90 font-medium"
          >
            GENERATE BOARD
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
