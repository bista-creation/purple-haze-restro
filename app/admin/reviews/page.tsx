'use client'

import React, { useState } from 'react'
import { MessageSquare, Star, CheckCircle2, Trash2, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminReviewsPage() {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      name: 'Sunil Basnet',
      email: 'sunil@example.com',
      phone: '9842055555',
      subject: 'Inquiry for 100 pax buffet dinner',
      message: 'Hello, we would like to book the garden area for an alumni reunion on Friday evening.',
      isReplied: false,
      date: 'Today, 10:20 AM',
    },
    {
      id: 'msg-2',
      name: 'Dr. Gita Adhikari',
      email: 'gita@example.com',
      phone: '9852033333',
      subject: 'Compliment to Chef on Thakali Thali',
      message: 'Had dinner with my medical colleagues yesterday. The Mustang potato sandeko and thali were marvelous!',
      isReplied: true,
      date: 'Yesterday',
    },
  ])

  const [reviews, setReviews] = useState([
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
  ])

  const toggleReply = (id: string) => {
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, isReplied: !m.isReplied } : m))
    )
    toast.success('Message reply status updated.')
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
          Guest Communications
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Reviews & Contact Form Messages
        </h1>
      </div>

      {/* Contact Messages Section */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" /> Contact Inquiries
        </h2>

        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 rounded-2xl border border-border/80 bg-background/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">{msg.name}</span>
                  <span className="text-[11px] text-muted-foreground">• {msg.email} • {msg.phone}</span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      msg.isReplied
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-gold-500/10 text-gold-600'
                    }`}
                  >
                    {msg.isReplied ? 'Replied' : 'Pending Response'}
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
                  onClick={() => toggleReply(msg.id)}
                  className="rounded-xl text-xs h-8"
                >
                  {msg.isReplied ? 'Mark Unreplied' : 'Mark as Replied'}
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
      </div>

      {/* Reviews Moderation */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
          <Star className="w-4 h-4 text-gold-500" /> Guest Ratings & Reviews
        </h2>

        <div className="space-y-3">
          {reviews.map((rev) => (
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
