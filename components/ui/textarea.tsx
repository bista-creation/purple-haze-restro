import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[100px] w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm text-gray-900',
          'placeholder:text-gray-400',
          'transition-all duration-200',
          'focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-purple-800/50 dark:bg-brand-charcoal dark:text-white dark:placeholder:text-gray-500',
          'resize-none',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
