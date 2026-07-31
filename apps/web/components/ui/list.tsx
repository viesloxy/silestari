"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

function List({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="list"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

function ListItem({
  className,
  asChild = false,
  selected = false,
  disabled = false,
  ...props
}: React.ComponentProps<"li"> & {
  asChild?: boolean
  selected?: boolean
  disabled?: boolean
}) {
  const Comp = asChild ? Slot : "li"

  return (
    <Comp
      data-slot="list-item"
      data-selected={selected}
      data-disabled={disabled}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        selected && "bg-accent text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    />
  )
}

function ListItemStart({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-start"
      className={cn("flex shrink-0 items-center", className)}
      {...props}
    />
  )
}

function ListItemEnd({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-end"
      className={cn("ml-auto flex shrink-0 items-center", className)}
      {...props}
    />
  )
}

export { List, ListItem, ListItemStart, ListItemEnd }
