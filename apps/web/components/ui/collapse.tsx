"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

import { cn } from "@/lib/utils"

interface CollapseProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Collapse({ open, onOpenChange, children, ...props }: CollapseProps) {
  return (
    <CollapsiblePrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Root>
  )
}

function CollapseContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      className={cn(
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden transition-all",
        className
      )}
      {...props}
    />
  )
}

export { Collapse, CollapseContent }
