import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT, generateLocalAiResponse, ChatResponse } from '@/lib/data/ai-knowledge'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    const lastMessage = messages[messages.length - 1]
    const userQuery = lastMessage?.content || ''

    if (!userQuery.trim()) {
      return NextResponse.json(
        { reply: 'Please ask a question so I can assist you!' },
        { status: 200 }
      )
    }

    // 1. Check for Gemini API Key if configured
    const geminiKey = process.env.GEMINI_API_KEY
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${SYSTEM_PROMPT}\n\nCustomer question: "${userQuery}"\n\nProvide a warm, concise, and helpful response. If recommending a dish, include its NPR price. Suggest appropriate links like /menu, /events, /reservations, or /contact where helpful.`,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
              },
            }),
          }
        )

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json()
          const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text
          if (candidateText) {
            // Also derive relevant quick actions
            const localFallback = generateLocalAiResponse(userQuery)
            return NextResponse.json({
              reply: candidateText,
              actions: localFallback.actions,
            })
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local engine:', err)
      }
    }

    // 2. Check for OpenAI API Key if configured
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...messages.slice(-5),
            ],
            max_tokens: 400,
            temperature: 0.7,
          }),
        })

        if (openaiRes.ok) {
          const openaiData = await openaiRes.json()
          const reply = openaiData.choices?.[0]?.message?.content
          if (reply) {
            const localFallback = generateLocalAiResponse(userQuery)
            return NextResponse.json({
              reply,
              actions: localFallback.actions,
            })
          }
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to local engine:', err)
      }
    }

    // 3. Built-in zero-latency domain AI engine (works 100% out-of-the-box)
    const localResult: ChatResponse = generateLocalAiResponse(userQuery)
    return NextResponse.json(localResult)
  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      {
        reply: "I'm having a brief connection issue. Please feel free to browse our menu or call our Biratnagar hotline directly at +977 9852022202!",
        actions: [
          { label: 'View Menu', url: '/menu' },
          { label: 'Call Restaurant', url: 'tel:+9779852022202' },
        ],
      },
      { status: 200 }
    )
  }
}
