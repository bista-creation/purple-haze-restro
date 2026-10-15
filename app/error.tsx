'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center">
      <div className="w-16 h-16 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-6 shadow-md">
        <AlertCircle className="w-8 h-8" />
      </div>

      <span className="text-xs uppercase tracking-widest text-destructive font-bold mb-2 block">
        Unexpected Kitchen Error
      </span>

      <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
        Something Went Wrong
      </h1>

      <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
        We encountered a momentary glitch while serving this page. Please try refreshing or return to the main dining room.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => reset()}
          className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-semibold h-11 px-6 shadow-md flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-border text-foreground hover:bg-muted rounded-xl text-xs font-semibold h-11 px-6"
        >
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
