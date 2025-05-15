"use client"

import type React from "react"
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface TooltipWrapperProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delayDuration?: number
}

export function TooltipWrapper({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 300,
}: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <TooltipRoot delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}
