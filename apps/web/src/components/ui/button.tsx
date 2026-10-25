import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-bold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-action text-white hover:bg-action-hover active:translate-y-px shadow-sm",
        action:
          "bg-action text-white hover:bg-action-hover active:translate-y-px shadow-sm",
        orange:
          "bg-action-accent text-white hover:bg-[#943a00] active:translate-y-px shadow-sm",
        secondary:
          "bg-surface-teal text-action hover:bg-[#d4f2ee] active:translate-y-px",
        outline:
          "border border-border bg-white text-ink hover:bg-surface-muted hover:text-action active:translate-y-px",
        ghost:
          "text-ink hover:bg-surface-muted hover:text-action",
        destructive:
          "bg-emergency text-white hover:bg-red-700 active:translate-y-px",
        link:
          "text-action underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-10 px-5 text-sm rounded-full gap-2",
        sm: "h-8 px-3.5 text-xs rounded-full gap-1.5",
        lg: "h-12 px-7 text-base rounded-full gap-2.5",
        hero: "h-14 px-8 text-lg rounded-full gap-3",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
