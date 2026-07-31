"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

const ratingVariants = cva("flex items-center gap-0.5", {
  variants: {
    color: {
      primary:
        "[&>svg[data-filled='true']]:fill-primary [&>svg[data-filled='true']]:text-primary",
      secondary:
        "[&>svg[data-filled='true']]:fill-secondary [&>svg[data-filled='true']]:text-secondary",
      info: "[&>svg[data-filled='true']]:fill-blue-500 [&>svg[data-filled='true']]:text-blue-500",
      success:
        "[&>svg[data-filled='true']]:fill-green-500 [&>svg[data-filled='true']]:text-green-500",
      warning:
        "[&>svg[data-filled='true']]:fill-yellow-500 [&>svg[data-filled='true']]:text-yellow-500",
      error:
        "[&>svg[data-filled='true']]:fill-destructive [&>svg[data-filled='true']]:text-destructive",
    },
  },
  defaultVariants: {
    color: "warning",
  },
})

interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof ratingVariants> {
  value?: number
  max?: number
  readonly?: boolean
  onValueChange?: (value: number) => void
  unratedIcon?: React.ComponentType<{ className?: string }>
  ratedIcon?: React.ComponentType<{ className?: string }>
}

function Rating({
  className,
  value = 0,
  max = 5,
  readonly = false,
  color,
  onValueChange,
  unratedIcon: UnratedIcon = Star,
  ratedIcon: RatedIcon = Star,
  ...props
}: RatingProps) {
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null)
  const displayValue = hoveredValue ?? value

  const handleClick = (index: number) => {
    if (!readonly && onValueChange) {
      onValueChange(index + 1)
    }
  }

  const handleMouseEnter = (index: number) => {
    if (!readonly) {
      setHoveredValue(index + 1)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredValue(null)
    }
  }

  return (
    <div
      className={cn(ratingVariants({ color }), className)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {[...Array(max)].map((_, index) => {
        const isFilled = index < displayValue
        const Icon = isFilled ? RatedIcon : UnratedIcon
        return (
          <Icon
            key={index}
            data-filled={isFilled}
            className={cn(
              "h-5 w-5 transition-colors",
              !readonly && "cursor-pointer",
              !isFilled && "fill-muted text-muted-foreground"
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
          />
        )
      })}
    </div>
  )
}

export { Rating, ratingVariants }
