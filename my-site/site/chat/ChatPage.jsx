import { useReducer, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import { resolveSubjectLocation } from '../taxonomy/contentTaxonomy'
import { CHAT_MODE, getChatErrorMessage, requestTutorReply } from './chatClient'
import { chatReducer, initialChatState } from './chatState'
import './ChatPage.css'

function MathMessage({ children }) {
  return (
    <div className="chat-message-content">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

export function ChatPage({ examId, subjectId, domainId, skillId, onNavigate }) {
  const target = resolveSubjectLocation(subjectId, { domainId, skillId })
  const isValid = target.status === 'valid'
    && target.subject?.examId === examId
    && target.skill?.tutorEnabled
  const [state, dispatch] = useReducer(chatReducer, initialChatState)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  if (!isValid) {
    return (
      <main className="chat-empty-page">
        <h1>AI tutor not available</h1>
        <p>This prototype only supports one configured SAT Math skill.</p>
        <button type="button" onClick={() => onNavigate('/topics.html?topic=sat-math')}>Browse SAT Math skills</button>
      </main>
    )
  }

  const canonicalTarget = { examId, subjectId, domainId, skillId }

  async function runRequest(request, isRetry = false) {
    dispatch({ type: isRetry ? 'retry' : 'send', request })
    try {
      const response = await requestTutorReply(request)
      dispatch({ type: 'success', response })
    } catch (error) {
      dispatch({ type: 'error', error: getChatErrorMessage(error) })
    }
  }

  function submit(event) {
    event.preventDefault()
    const message = draft.trim()
    if (!message || state.status === 'loading') return
    const history = state.messages.slice(-10).map(({ role, content }) => ({ role, content }))
    setDraft('')
    void runRequest({ target: canonicalTarget, message, history })
  }

  function retry() {
    if (state.retryRequest) void runRequest(state.retryRequest, true)
  }

  return (
    <main className="chat-page">
      <header className="chat-header">
        <button type="button" className="chat-back" onClick={() => onNavigate(`/topics.html?topic=${subjectId}&domain=${domainId}&skill=${skillId}`)}>
          Back to skills
        </button>
        <p>SAT Math AI tutor prototype</p>
        <h1>{target.skill.label}</h1>
        <span>{target.domain.label}</span>
      </header>

      <div className="chat-prototype-notice" role="note">
        {CHAT_MODE === 'mock'
          ? 'Local mock mode: responses use a small set of original sample material. Gemini is not being called.'
          : 'Gemini mode: responses are grounded in a small set of original sample material.'}
      </div>

      <section className="chat-panel" aria-label="Tutor conversation">
        <div className="chat-messages" aria-live="polite">
          {state.messages.length === 0 ? (
            <div className="chat-welcome">
              <h2>Ask about a linear equation</h2>
              <p>Try “How do I solve 3x + 5 = 20?” or ask for an alternative method.</p>
              <p>The tutor will name the original sample material it used. If its context is insufficient, it will say so.</p>
            </div>
          ) : state.messages.map((message, index) => (
            <article className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
              <strong>{message.role === 'user' ? 'You' : 'Tutor'}</strong>
              {message.role === 'assistant'
                ? <MathMessage>{message.content || message.answer}</MathMessage>
                : <p>{message.content || message.answer}</p>}
              {message.role === 'assistant' ? (
                <div className="chat-sources">
                  {message.insufficient
                    ? 'Supplied context was insufficient.'
                    : `Material used: ${message.sourceIds.join(', ') || 'No valid source returned.'}`}
                </div>
              ) : null}
            </article>
          ))}
          {state.status === 'loading' ? (
            <div className="chat-loading" role="status"><span /> Tutor is working through it step by step…</div>
          ) : null}
          {state.status === 'error' ? (
            <div className="chat-error" role="alert">
              <strong>Something went wrong</strong>
              <p>{state.error}</p>
              <button type="button" onClick={retry}>Retry last message</button>
            </div>
          ) : null}
        </div>

        <form className="chat-composer" onSubmit={submit}>
          <label htmlFor="chat-message">Your question</label>
          <textarea
            id="chat-message"
            ref={inputRef}
            value={draft}
            maxLength="1200"
            placeholder="Ask for an explanation or another method…"
            disabled={state.status === 'loading'}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div>
            <span>{draft.length}/1200</span>
            <button type="submit" disabled={!draft.trim() || state.status === 'loading'}>Send</button>
          </div>
        </form>
      </section>
    </main>
  )
}
