'use client'

import { useState } from 'react'
import { Send, Lock } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

type Message = {
  id: string
  authorName: string
  authorId: string
  body: string
  createdAt: string
}

export function DealChat({
  dealId,
  currentUserId,
  initialMessages,
}: {
  dealId: string
  currentUserId: string
  initialMessages: Message[]
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [value, setValue] = useState('')
  const [sending, setSending] = useState(false)
  const { t } = useLanguage()

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const body = value.trim()
    if (!body || sending) return

    setSending(true)
    setValue('')

    const res = await fetch(`/api/deals/${dealId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })

    setSending(false)

    if (res.ok) {
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          id: data.message.id,
          authorName: data.message.author.name,
          authorId: data.message.authorId,
          body: data.message.body,
          createdAt: data.message.createdAt,
        },
      ])
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Lock className="size-4 text-emerald" />
        <h3 className="font-semibold text-foreground">{t.dealDetail.chatTitle}</h3>
      </div>

      <div className="flex max-h-96 flex-col gap-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">{t.dealDetail.noMessages}</p>
        )}
        {messages.map((m) => {
          const self = m.authorId === currentUserId
          return (
            <div key={m.id} className={self ? 'flex justify-end' : 'flex justify-start'}>
              <div className="max-w-[80%]">
                <div
                  className={
                    self
                      ? 'rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground'
                      : 'rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5 text-sm text-foreground'
                  }
                >
                  {m.body}
                </div>
                <div className={`mt-1 text-xs text-muted-foreground ${self ? 'text-right' : 'text-left'}`}>
                  {self ? t.dealDetail.you : m.authorName} ·{' '}
                  {new Date(m.createdAt).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.dealDetail.writeMessage}
          className="h-10 flex-1 rounded-xl border border-input bg-background px-3.5 text-sm text-foreground outline-none focus-visible:border-emerald focus-visible:ring-4 focus-visible:ring-emerald/15"
        />
        <button
          type="submit"
          disabled={sending}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald text-emerald-foreground transition-colors hover:bg-emerald/90 disabled:opacity-60"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}
