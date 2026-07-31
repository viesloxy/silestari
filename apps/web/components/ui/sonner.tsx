"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

import { cn } from "@/lib/utils"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn(
        "toaster group [&>li]:flex [&>li]:items-start [&>li]:gap-3"
      )}
      icons={{
        success: (
          <CircleCheckIcon className="mt-0.5 size-4 shrink-0 text-green-500" />
        ),
        info: <InfoIcon className="mt-0.5 size-4 shrink-0 text-blue-500" />,
        warning: (
          <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-yellow-500" />
        ),
        error: <OctagonXIcon className="mt-0.5 size-4 shrink-0 text-red-500" />,
        loading: (
          <Loader2Icon className="mt-0.5 size-4 shrink-0 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
