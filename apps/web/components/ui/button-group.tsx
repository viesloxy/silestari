import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonGroupVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default: "",
      ghost: "",
      outline: "",
      solid: "",
      gradient: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
    fullWidth: {
      true: "w-full",
      false: "",
    },
    pill: {
      true: "[&>button]:first:rounded-l-full [&>button]:last:rounded-r-full [&>button]:rounded-none",
      false:
        "[&>button]:first:rounded-l-md [&>button]:last:rounded-r-md [&>button]:rounded-none",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    fullWidth: false,
    pill: false,
  },
})

interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  children: React.ReactNode
}

function ButtonGroup({
  className,
  variant,
  size,
  fullWidth,
  pill,
  children,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        buttonGroupVariants({ variant, size, fullWidth, pill }),
        "[&>button:not(:first-child)]:border-l-0",
        "[&>button:not(:first-child)]:rounded-l-none",
        "[&>button:not(:last-child)]:rounded-r-none",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<{ className?: string }>(child)) {
          return React.cloneElement(child, {
            className: cn(
              child.props.className,
              index === 0 && "rounded-l-md",
              index === React.Children.count(children) - 1 && "rounded-r-md",
              index !== 0 &&
                index !== React.Children.count(children) - 1 &&
                "rounded-none",
              pill && index === 0 && "rounded-l-full",
              pill &&
                index === React.Children.count(children) - 1 &&
                "rounded-r-full",
              index !== 0 && "border-l-0"
            ),
          } as React.HTMLAttributes<HTMLElement>)
        }
        return child
      })}
    </div>
  )
}

export { ButtonGroup, buttonGroupVariants }
