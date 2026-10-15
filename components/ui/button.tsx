import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-brand hover:bg-purple-700 hover:shadow-brand-lg',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border-2 border-primary/40 bg-background text-primary hover:bg-primary/10 hover:border-primary dark:border-purple-500/40 dark:text-purple-300 dark:hover:bg-purple-900/30',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-purple-200/80 font-bold dark:hover:bg-purple-900/50',
        ghost:
          'text-foreground hover:bg-purple-100/80 hover:text-primary dark:text-purple-200 dark:hover:bg-purple-900/40 dark:hover:text-white',
        link: 'text-primary underline-offset-4 hover:underline font-semibold',
        gold:
          'bg-gradient-to-r from-amber-500 via-gold-500 to-amber-500 text-charcoal-950 font-bold shadow-gold hover:opacity-95 hover:shadow-lg',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 rounded-lg px-4 py-2 text-xs',
        lg: 'h-13 rounded-xl px-8 py-3 text-base',
        xl: 'h-14 rounded-2xl px-10 py-3.5 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8 rounded-lg',
        'icon-lg': 'h-12 w-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
