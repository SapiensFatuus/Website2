import { useEffect, useReducer, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import { getChatErrorMessage, requestTutorReply } from './chatClient'
import { chatReducer, initialChatState } from './chatState'
import {
  createInitialTutorPrompt,
  createOpeningPromptKey,
  claimOpeningPrompt,
  getTutorUiScopeDetails,
  resolveTutorUiTarget,
} from './tutorScopes'
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

export function ChatPage({ examId, subjectId, scope, domainId, skillId, returnTo, onNavigate }) {
  const routeTarget = resolveTutorUiTarget({ examId, subjectId, scope, domainId, skillId })
  const routeDetails = getTutorUiScopeDetails(routeTarget)
  const openingPrompt = createInitialTutorPrompt(routeTarget)
  const openingPromptKey = createOpeningPromptKey(routeTarget)
  const [state, dispatch] = useReducer(chatReducer, initialChatState)
  const [draft, setDraft] = useState('')
  const [activeTarget, setActiveTarget] = useState(routeTarget)
  const submittedOpeningPrompts = useRef(new Set())
  const inputRef = useRef(null)

  async function runRequest(request, isRetry = false) {
    dispatch({ type: isRetry ? 'retry' : 'send', request })
    try {
      const response = await requestTutorReply(request)
      if (response.effectiveTarget) setActiveTarget(response.effectiveTarget)
      dispatch({ type: 'success', response })
    } catch (error) {
      dispatch({ type: 'error', error: getChatErrorMessage(error) })
    }
  }

  useEffect(() => {
    if (!openingPrompt || !claimOpeningPrompt(submittedOpeningPrompts.current, openingPromptKey)) return
    void runRequest({ target: routeTarget, message: openingPrompt, history: [] })
  }, [openingPrompt, openingPromptKey, routeTarget])

  if (!routeTarget || !routeDetails) {
    return (
      <main className="chat-empty-page">
        <h1>AI tutor not available</h1>
        <p>This test tutor is not available yet.</p>
        <button type="button" onClick={() => onNavigate('/index.html')}>Return to test search</button>
      </main>
    )
  }

  function submit(event) {
    event.preventDefault()
    const message = draft.trim()
    if (!message || state.status === 'loading') return
    const history = state.messages.slice(-10).map(({ role, content }) => ({ role, content }))
    setDraft('')
    void runRequest({ target: activeTarget || routeTarget, message, history })
  }

  function retry() {
    if (state.retryRequest) void runRequest(state.retryRequest, true)
  }

  const backUrl = subjectId === 'sat-math' && (routeTarget.domainId || returnTo === 'units')
    ? `/topics.html?topic=${subjectId}${routeTarget.domainId ? `&domain=${routeTarget.domainId}` : ''}${routeTarget.skillId ? `&skill=${routeTarget.skillId}` : ''}`
    : `/topic.html?topic=${subjectId}`

  return (
    <main className="chat-page">
      <header className="chat-header">
        <button type="button" className="chat-back" onClick={() => onNavigate(backUrl)}>Back</button>
        <h1>{routeDetails.subject.label} Tutor</h1>
        <p>Ask a question, work through a problem, or make a study plan. I’ll focus on whatever you need.</p>
      </header>

      <section className="chat-panel" aria-label={`${routeDetails.subject.label} tutor conversation`}>
        <div className="chat-messages" aria-live="polite">
          {state.messages.length === 0 ? (
            <div className="chat-welcome">
              <h2>What can I help you with?</h2>
              <p>Ask about any part of {routeDetails.subject.label}, from one question to the whole test.</p>
            </div>
          ) : state.messages.map((message, index) => (
            <article className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
              <strong>{message.role === 'user' ? 'You' : 'Tutor'}</strong>
              {message.role === 'assistant'
                ? <MathMessage>{message.content}</MathMessage>
                : <p>{message.content}</p>}
            </article>
          ))}
          {state.status === 'loading' ? (
            <div className="chat-loading" role="status"><span /> Tutor is thinking...</div>
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
            placeholder={`Ask the ${routeDetails.subject.label} Tutor...`}
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
