'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  UtensilsCrossed,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  actions?: Array<{ label: string; url: string }>
  timestamp: string
}

const QUICK_PROMPTS = [
  '🍛 What are your popular Nepali dishes?',
  '🎉 Banquet Hall capacity & booking',
  '🌿 Pure vegetarian options',
  '🏷️ Active discount coupons',
  '🛵 Delivery zones & charges',
  '🕒 Opening hours & location',
]

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content:
      '**Namaste! 🙏 Welcome to Purple Haze Restro & Garden!**\n\nI am your **AI Dining Concierge**. I can help you with:\n• Dish recommendations & prices (NPR)\n• Banquet Hall & Garden venue bookings\n• Table reservations & delivery zones\n\nWhat would you like to explore today?',
    actions: [
      { label: '📖 Browse Menu', url: '/menu' },
      { label: '🎉 Book Venue', url: '/events' },
      { label: '🍽️ Table Reservation', url: '/reservations' },
    ],
    timestamp: 'Just now',
  },
]

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load from session storage if available
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('ph_chat_history')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, [])

  // Save to session storage
  useEffect(() => {
    try {
      if (messages.length > 1) {
        sessionStorage.setItem('ph_chat_history', JSON.stringify(messages))
      }
    } catch {
      // Ignore
    }
  }, [messages])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [isOpen])

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text || isLoading) return

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error('Failed to fetch response')
      const data = await res.json()

      const botMessage: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Namaste! Please let me know how I can help you today.',
        actions: data.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch {
      const fallbackMessage: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content:
          'I apologize for the momentary hiccup. You can explore our menu directly or call our Biratnagar hotline at **+977 9852022202**!',
        actions: [
          { label: 'View Menu', url: '/menu' },
          { label: 'Call Restaurant', url: 'tel:+9779852022202' },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES)
    try {
      sessionStorage.removeItem('ph_chat_history')
    } catch {
      // Ignore
    }
  }

  // Format simple markdown (bold, lists, italics)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n')
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />

          // Parse bold (**text**) and italic (*text* or _text_)
          const parts = line.split(/(\*\*.*?\*\*|_.*?_|\*.*?\*)/g)

          const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-foreground">
                  {part.slice(2, -2)}
                </strong>
              )
            }
            if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
              return (
                <em key={pIdx} className="italic text-muted-foreground">
                  {part.slice(1, -1)}
                </em>
              )
            }
            return part
          })

          if (line.startsWith('• ') || line.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-primary font-bold text-xs mt-0.5">•</span>
                <span className="flex-1">{formattedLine}</span>
              </div>
            )
          }

          return <p key={idx}>{formattedLine}</p>
        })}
      </div>
    )
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {/* Notification Pill */}
              {hasUnread && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-bold text-slate-950 items-center justify-center">
                    1
                  </span>
                </span>
              )}

              <button
                onClick={() => setIsOpen(true)}
                className="group flex items-center gap-2.5 bg-gradient-to-r from-purple-700 via-primary to-purple-800 text-white px-4 py-3 rounded-full shadow-xl shadow-purple-900/30 hover:shadow-2xl hover:shadow-purple-900/40 border border-gold-400/40 transition-all duration-300"
                aria-label="Open AI Dining Concierge"
              >
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-gold-300">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
                <div className="flex flex-col text-left pr-1 hidden sm:flex">
                  <span className="text-xs font-bold leading-tight flex items-center gap-1 text-gold-200">
                    Ask AI Concierge
                  </span>
                  <span className="text-[10px] text-purple-200 leading-tight">
                    Menu, Venues & Orders
                  </span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] max-w-[420px] h-[580px] max-h-[85vh] flex flex-col bg-card/95 backdrop-blur-xl border border-border/80 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-primary/20"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-900 via-primary to-purple-800 text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 border-b border-purple-700/50">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-300 shadow-inner">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-purple-950 rounded-full" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                    HazeBot <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  </h3>
                  <p className="text-[10px] text-purple-200 font-medium">
                    AI Concierge • Biratnagar, Nepal
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  title="Reset Conversation"
                  className="w-8 h-8 rounded-full text-purple-200 hover:text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full text-purple-200 hover:text-white hover:bg-white/10"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Prompts Carousel */}
            <div className="bg-muted/40 border-b border-border/60 py-2 px-3 overflow-x-auto no-scrollbar flex gap-1.5 shrink-0">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="shrink-0 text-[11px] font-medium bg-card hover:bg-primary/10 text-foreground hover:text-primary border border-border/70 rounded-full px-3 py-1 transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 overscroll-contain">
              {messages.map((msg) => {
                const isUser = msg.role === 'user'

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 shadow-sm transition-all ${
                        isUser
                          ? 'bg-primary text-white rounded-br-xs'
                          : 'bg-muted/70 dark:bg-muted/40 text-foreground border border-border/70 rounded-bl-xs'
                      }`}
                    >
                      {!isUser && (
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary dark:text-purple-300 mb-1">
                          <Bot className="w-3 h-3" /> Purple Haze Assistant
                        </div>
                      )}

                      {renderFormattedContent(msg.content)}

                      {/* Interactive Action Pills */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-border/60 flex flex-wrap gap-1.5">
                          {msg.actions.map((act, aIdx) => (
                            <Link
                              key={aIdx}
                              href={act.url}
                              onClick={() => {
                                if (!act.url.startsWith('tel:') && !act.url.startsWith('http')) {
                                  setIsOpen(false)
                                }
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 hover:bg-primary hover:text-white text-primary dark:bg-purple-950/60 dark:text-purple-200 border border-primary/30 rounded-lg px-2.5 py-1 transition-all"
                            >
                              <span>{act.label}</span>
                              <ArrowRight className="w-3 h-3 opacity-70" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-muted-foreground mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                )
              })}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 max-w-[70%] bg-muted/70 border border-border/70 rounded-2xl rounded-bl-xs p-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] text-muted-foreground ml-1">Thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="p-3 bg-card border-t border-border/80 shrink-0"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about dishes, pricing, venues, or orders..."
                  disabled={isLoading}
                  className="flex-1 bg-muted/60 text-foreground text-xs sm:text-sm rounded-full px-4 py-2.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground disabled:opacity-60"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="rounded-full w-9 h-9 bg-primary hover:bg-purple-700 text-white shrink-0 disabled:opacity-40"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground/80 mt-1.5">
                AI can make mistakes. For urgent bookings, call{' '}
                <a href="tel:+9779852022202" className="underline hover:text-primary">
                  +977 9852022202
                </a>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
