import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, CornerDownRight, Radio, Send, X } from 'lucide-react'
import './SignalChat.css'

const starterRoutes = [
  { label: 'Show me the work', prompt: 'Show me the projects you have done.' },
  { label: 'What do you do?', prompt: 'What does LLeveLL actually do?' },
  { label: 'Meet the minds', prompt: 'Who is behind LLeveLL?' },
  { label: 'I have an idea', prompt: 'I have a project idea. How do we start?' },
]

const siteContext = {
  name: 'LLeveLL',
  positioning: 'A connected digital studio combining strategy, design, development, growth and AI.',
  sections: ['Services', 'About / Team', 'AI approach', 'Selected projects', 'Apps', 'Start Something'],
}

const createMessage = (role, text, actions = []) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  role,
  text,
  actions,
})

function localAnswer(rawMessage) {
  const message = rawMessage.toLowerCase()

  if (/project|work|portfolio|case stud|made at|show.*work/.test(message)) {
    return {
      text: 'The quickest proof is the work itself. I can take you straight to MADE AT LLeveLL — selected projects and real outcomes.',
      actions: [{ label: 'View selected projects', type: 'navigate', target: 'team' }],
    }
  }

  if (/team|people|who.*behind|minds|designer|samuel|abdul/.test(message)) {
    return {
      text: 'LLeveLL is built around connected disciplines, not hand-offs. Meet the minds behind the studio and see how the team works together.',
      actions: [{ label: 'Meet the minds', type: 'navigate', target: 'about' }],
    }
  }

  if (/service|what.*do|offer|design|develop|branding|marketing|growth|seo|ui|ux/.test(message)) {
    return {
      text: 'LLeveLL connects strategy, UI/UX, product development, branding, marketing and AI into one studio. The point is simple: fewer gaps between the idea and the thing people actually experience.',
      actions: [{ label: 'Explore services', type: 'navigate', target: 'services' }],
    }
  }

  if (/ai|artificial|automation|intelligence/.test(message)) {
    return {
      text: 'AI is used as an accelerator across research, design, development, content, testing and optimization — while the judgment, strategy and creative direction stay human.',
      actions: [{ label: 'See the AI approach', type: 'navigate', target: 'ai-approach' }],
    }
  }

  if (/app|apps|tool|product/.test(message)) {
    return {
      text: 'There is a separate Apps space inside the site. I can open it without taking you away from what you are viewing.',
      actions: [{ label: 'Open LLeveLL apps', type: 'apps' }],
    }
  }

  if (/contact|start|idea|brief|quote|price|cost|project idea|work with|hire/.test(message)) {
    return {
      text: 'Bring the rough version. A few details are enough to start. I can open the LLeveLL project brief and you can send the spark from there.',
      actions: [{ label: 'Start something', type: 'contact' }],
    }
  }

  if (/hello|hey|hi\b|yo\b|sup\b/.test(message)) {
    return {
      text: 'Hey. You found the signal. Ask me about the work, the team, what LLeveLL builds — or bring me an idea.',
      actions: [],
    }
  }

  return {
    text: 'I can guide you through LLeveLL without making you hunt through the site. Ask about the work, services, team, apps, AI approach — or tell me what you want to build.',
    actions: [
      { label: 'Show the work', type: 'navigate', target: 'team' },
      { label: 'Start something', type: 'contact' },
    ],
  }
}

function WordReveal({ text }) {
  const words = useMemo(() => text.split(/(\s+)/), [text])

  return (
    <span className="signal-word-reveal">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={word.trim() ? 'signal-word' : 'signal-space'}
          style={word.trim() ? { '--word-index': index } : undefined}
        >
          {word}
        </span>
      ))}
    </span>
  )
}

export default function SignalChat({
  open,
  onOpen,
  onClose,
  onNavigate,
  onApps,
  onContact,
  blocked = false,
}) {
  const [messages, setMessages] = useState(() => [
    createMessage(
      'assistant',
      'You found the signal. Ask about the work, the team, the apps — or bring me an idea.',
    ),
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const transcriptRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const id = window.setTimeout(() => inputRef.current?.focus(), 380)
    return () => window.clearTimeout(id)
  }, [open])

  useEffect(() => {
    if (!open || !transcriptRef.current) return
    transcriptRef.current.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, thinking, open])

  const runAction = (action) => {
    if (action.type === 'navigate') {
      onNavigate?.(action.target)
      return
    }

    if (action.type === 'apps') {
      onApps?.()
      return
    }

    if (action.type === 'contact') {
      onContact?.()
    }
  }

  const ask = async (value) => {
    const clean = value.trim()
    if (!clean || thinking) return

    const userMessage = createMessage('user', clean)
    setMessages((current) => [...current, userMessage])
    setInput('')
    setThinking(true)

    const endpoint = import.meta.env.VITE_LLEVELL_CHAT_ENDPOINT
    let answer = null

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: clean,
            history: messages.map(({ role, text }) => ({ role, content: text })),
            context: siteContext,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const reply =
            data.reply ||
            data.message ||
            data?.choices?.[0]?.message?.content

          if (reply) {
            answer = {
              text: reply,
              actions: Array.isArray(data.actions) ? data.actions : [],
            }
          }
        }
      } catch {
        // The built-in site guide remains available if the AI endpoint is offline.
      }
    }

    if (!answer) answer = localAnswer(clean)

    window.setTimeout(() => {
      setThinking(false)
      setMessages((current) => [
        ...current,
        createMessage('assistant', answer.text, answer.actions),
      ])
    }, endpoint ? 260 : 420)
  }

  const submit = (event) => {
    event.preventDefault()
    ask(input)
  }

  return (
    <>
      <button
        className={`signal-launcher ${(open || blocked) ? 'signal-launcher--hidden' : ''}`}
        type="button"
        onClick={blocked ? undefined : onOpen}
        aria-label="Open LLeveLL Signal assistant"
        aria-hidden={blocked}
      >
        <span className="signal-launcher__meter" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </span>
        <span className="signal-launcher__copy">
          <small>ASK LLEVELL</small>
          <strong>SIGNAL</strong>
        </span>
        <Radio size={18} strokeWidth={1.8} />
      </button>

      <aside
        className={`signal-panel ${open ? 'signal-panel--open' : ''}`}
        aria-hidden={!open}
        aria-label="LLeveLL Signal AI assistant"
      >
        <div className="signal-panel__shadow signal-panel__shadow--pink" aria-hidden="true" />
        <div className="signal-panel__shadow signal-panel__shadow--lime" aria-hidden="true" />

        <section className="signal-panel__card" data-lenis-prevent>
          <header className="signal-panel__header">
            <div className="signal-panel__identity">
              <span className="signal-panel__mark" aria-hidden="true">
                <span className="signal-panel__meter-copy">
                  <i /><i /><i /><i /><i />
                </span>
              </span>
              <div>
                <strong>LLeveLL SIGNAL</strong>
                <small>AI ASSISTANT / SITE GUIDE</small>
              </div>
            </div>

            <div className="signal-panel__live">
              <span /> LIVE
            </div>

            <button type="button" onClick={onClose} aria-label="Close LLeveLL Signal">
              <X size={20} strokeWidth={1.65} />
            </button>
          </header>

          <div className="signal-panel__scan" aria-hidden="true">
            <span>01</span><i /><i /><i /><i /><i /><i /><span>08</span>
          </div>

          <div className="signal-transcript" ref={transcriptRef}>
            {messages.map((message) => (
              <article
                key={message.id}
                className={`signal-message signal-message--${message.role}`}
              >
                <div className="signal-message__label">
                  {message.role === 'assistant' ? 'L. / SIGNAL' : 'YOU / INPUT'}
                </div>

                <div className="signal-message__body">
                  {message.role === 'assistant' ? (
                    <WordReveal text={message.text} />
                  ) : (
                    message.text
                  )}
                </div>

                {message.actions?.length > 0 && (
                  <div className="signal-message__actions">
                    {message.actions.map((action) => (
                      <button
                        key={`${message.id}-${action.label}`}
                        type="button"
                        onClick={() => runAction(action)}
                      >
                        <span>{action.label}</span>
                        <ArrowUpRight size={15} strokeWidth={1.7} />
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}

            {thinking && (
              <article className="signal-message signal-message--assistant signal-message--thinking">
                <div className="signal-message__label">L. / SIGNAL</div>
                <div className="signal-thinking" aria-label="LLeveLL Signal is thinking">
                  <i /><i /><i /><i />
                </div>
              </article>
            )}
          </div>

          <div className="signal-routes" aria-label="Suggested questions">
            {starterRoutes.map((route, index) => (
              <button key={route.label} type="button" onClick={() => ask(route.prompt)}>
                <small>0{index + 1}</small>
                <span>{route.label}</span>
                <CornerDownRight size={14} strokeWidth={1.6} />
              </button>
            ))}
          </div>

          <form className="signal-composer" onSubmit={submit}>
            <label htmlFor="llevell-signal-input">TYPE A SIGNAL</label>
            <div>
              <input
                ref={inputRef}
                id="llevell-signal-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask something, or bring an idea…"
                autoComplete="off"
              />
              <button type="submit" disabled={!input.trim() || thinking} aria-label="Send message">
                <Send size={17} strokeWidth={1.8} />
              </button>
            </div>
          </form>
        </section>
      </aside>
    </>
  )
}
