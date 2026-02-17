import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold uppercase tracking-widest ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-[2px] active:border-b-0 select-none",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground border-b-[4px] border-primary/50 hover:bg-primary/95 hover:border-b-[6px] active:border-b-0",
                secondary: "bg-secondary text-secondary-foreground border-b-[4px] border-secondary/50 hover:bg-secondary/95 hover:border-b-[6px] active:border-b-0", // Gold
                outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-500 border-b-[4px] active:border-b-0",
                ghost: "hover:bg-accent hover:text-accent-foreground border-b-0 active:translate-y-0",
                danger: "bg-red-500 text-white border-b-[4px] border-red-700 hover:bg-red-600 active:border-b-0",
                super: "bg-indigo-500 text-white border-b-[4px] border-indigo-700 hover:bg-indigo-600 active:border-b-0",
                locked: "bg-slate-200 text-slate-400 border-b-[4px] border-slate-300 pointer-events-none",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-lg px-3",
                lg: "h-14 rounded-2xl px-8 text-base",
                icon: "h-11 w-11",
            },
            fullWidth: {
                true: "w-full",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
