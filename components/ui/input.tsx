import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm text-gray-900',
          'placeholder:text-gray-400',
          'transition-all duration-200',
          'focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-purple-800/50 dark:bg-brand-charcoal dark:text-white dark:placeholder:text-gray-500',
          'dark:focus:border-purple-500',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
