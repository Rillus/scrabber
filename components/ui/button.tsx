import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "Button",
  {
    variants: {
      variant: {
        default: "Button--default",
        destructive: "Button--destructive",
        outline: "Button--outline",
        secondary: "Button--secondary",
        ghost: "Button--ghost",
        link: "Button--link",
      },
      size: {
        default: "Button--default",
        sm: "Button--sm",
        lg: "Button--lg",
        icon: "Button--icon",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
