'use client'

import React, { useState, useEffect } from 'react'
import { MessageSquare, Star, CheckCircle2, Mail, Phone, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  isRead?: boolean
  isReplied: boolean
  createdAt: string
}

const SAMPLE_MESSAGES: ContactMessage[] = [
  {
    id: 'sample-1',
    name: 'Sunil Basnet',
    email: 'sunil@example.com',
    phone: '9842055555',
    subject: 'Inquiry for 100 pax buffet dinner',
    message: 'Hello, we would like to book the garden area for an alumni reunion on Friday evening.',
    isReplied: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    name: 'Dr. Gita Adhikari',
    email: 'gita@example.com',
    phone: '9852033333',
    subject: 'Compliment to Chef on Thakali Thali',
    message: 'Had dinner with my medical colleagues yesterday. The Mustang potato sandeko and thali were marvelous!',
    isReplied: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

const SAMPLE_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Anup Sharma',
    rating: 5,
    comment: 'Top notch service and amazing open garden ambiance in Biratnagar. The pizza was crispy and delicious!',
    status: 'APPROVED',
    date: '2 days ago',
  },
  {
    id: 'rev-2',
    author: 'Nirmal Rai',
    rating: 4,
    comment: 'Quick delivery within 30 minutes to Tintoliya. Steamed momo was juicy and achar had authentic flavor.',
    status: 'APPROVED',
    date: '3 days ago',
  },
]

export default function AdminReviewsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [isSampleData, setIsSampleData] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/contact')
      if (!res.ok) throw new Error('Failed to load contact inquiries')
      const json = await res.json()
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setMessages(json.data)
        setIsSampleData(false)
      } else {
        setMessages(SAMPLE_MESSAGES)
        setIsSampleData(true)
      }
    } catch {
      setMessages(SAMPLE_MESSAGES)
      setIsSampleData(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const toggleReply = async (msg: ContactMessage) => {
    const newStatus = !msg.isReplied

    // Optimistic local update
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isReplied: newStatus } : m))
    )

    if (isSampleData || msg.id.startsWith('sample-')) {
      toast.success(newStatus ? 'Marked as replied (Demo mode)' : 'Marked as pending (Demo mode)')
      return
    }

    try {
      setUpdatingId(msg.id)
      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, isReplied: newStatus }),
      })
      const result = await res.json()
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Update failed')
      }
      toast.success(newStatus ? 'Inquiry marked as replied' : 'Inquiry marked as pending response')
    } catch (err: any) {
      toast.error(err.message || 'Could not update status')
      // Revert on error
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isReplied: msg.isReplied } : m))
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
            Guest Communications
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Reviews & Contact Form Messages
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchMessages}
          disabled={loading}
          className="rounded-xl border-border self-start sm:self-auto gap-2 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Messages
        </Button>
      </div>

      {/* Contact Messages Section */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> Contact Inquiries
          </h2>
          {isSampleData && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Sample Inquiries (No DB Records Yet)
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-muted-foreground space-y-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading contact messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-xs">
            No contact inquiries found.
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-2xl border border-border/80 bg-background/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:border-primary/30"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-foreground">{msg.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      • {msg.email} {msg.phone ? `• ${msg.phone}` : ''}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.isReplied
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}
                    >
                      {msg.isReplied ? 'Replied' : 'Pending Response'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-primary">{msg.subject}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    &ldquo;{msg.message}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updatingId === msg.id}
                    onClick={() => toggleReply(msg)}
                    className="rounded-xl text-xs h-8"
                  >
                    {msg.isReplied ? 'Mark Pending' : 'Mark Replied'}
                  </Button>
                  <Button asChild size="sm" className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs h-8">
                    <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}>
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Moderation */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <Star className="w-4 h-4 text-gold-500" /> Guest Ratings & Reviews
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
            Curated Public Highlights
          </span>
        </div>

        <div className="space-y-3">
          {SAMPLE_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl border border-border/80 bg-background/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs text-foreground">{rev.author}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">• {rev.date}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {rev.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
