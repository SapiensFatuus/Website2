import { useEffect, useReducer, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import { getChatErrorMessage, requestTutorReply } from './chatClient'
import { uploadTutorImage, validateTutorImage } from './chatAttachments'
import { chatReducer, initialChatState } from './chatState'
import { useAuth } from '../auth/AuthContext'
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
  const { authStatus, isAuthenticating, signIn, user } = useAuth()
  const routeTarget = resolveTutorUiTarget({ examId, subjectId, scope, domainId, skillId })
  const routeDetails = getTutorUiScopeDetails(routeTarget)
  const openingPrompt = createInitialTutorPrompt(routeTarget)
  const openingPromptKey = createOpeningPromptKey(routeTarget)
  const [state, dispatch] = useReducer(chatReducer, initialChatState)
  const [draft, setDraft] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [attachmentError, setAttachmentError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [activeTarget, setActiveTarget] = useState(routeTarget)
  const submittedOpeningPrompts = useRef(new Set())
  const inputRef = useRef(null)
  const attachmentInputRef = useRef(null)

  async function runRequest(request, isRetry = false) {
    // The server deletes uploaded images after every attempt, so photo
    // requests cannot safely be replayed from the chat history.
    const retryRequest = request.attachment ? null : request
    dispatch({ type: isRetry ? 'retry' : 'send', request: retryRequest || request })
    try {
      const response = await requestTutorReply(request)
      if (response.effectiveTarget) setActiveTarget(response.effectiveTarget)
      dispatch({ type: 'success', response })
    } catch (error) {
      dispatch({ type: 'error', error: getChatErrorMessage(error), retryable: Boolean(retryRequest) })
    }
  }

  useEffect(() => {
    if (!openingPrompt || !claimOpeningPrompt(submittedOpeningPrompts.current, openingPromptKey)) return
    void runRequest({ target: routeTarget, message: openingPrompt, history: [] })
  }, [openingPrompt, openingPromptKey, routeTarget])

  useEffect(() => () => {
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
  }, [attachment])

  if (!routeTarget || !routeDetails) {
    return (
      <main className="chat-empty-page">
        <h1>AI tutor not available</h1>
        <p>This test tutor is not available yet.</p>
        <button type="button" onClick={() => onNavigate('/index.html')}>Return to test search</button>
      </main>
    )
  }

  function clearAttachment() {
    setAttachment(null)
    setAttachmentError('')
    if (attachmentInputRef.current) attachmentInputRef.current.value = ''
  }

  function selectAttachment(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (authStatus !== 'signed-in' || !user) {
      setAttachmentError('Sign in with Google to attach a homework photo.')
      event.target.value = ''
      return
    }
    const error = validateTutorImage(file)
    if (error) {
      setAttachmentError(error)
      event.target.value = ''
      return
    }
    setAttachmentError('')
    setAttachment({ file, previewUrl: URL.createObjectURL(file) })
  }

  async function submit(event) {
    event.preventDefault()
    const message = draft.trim()
    if (!message || state.status === 'loading' || isUploading) return
    const history = state.messages.slice(-10).map(({ role, content }) => ({ role, content }))
    setDraft('')
    let attachmentPath
    try {
      if (attachment) {
        setIsUploading(true)
        attachmentPath = await uploadTutorImage(attachment.file, user?.uid)
      }
      await runRequest({ target: activeTarget || routeTarget, message, history, ...(attachmentPath ? { attachment: { storagePath: attachmentPath } } : {}) })
      if (attachmentPath) clearAttachment()
    } catch (error) {
      setDraft(message)
      setAttachmentError(error.message || 'Your photo could not be uploaded. Try again.')
    } finally {
      setIsUploading(false)
    }
  }

  function retry() {
    if (state.retryRequest) void runRequest(state.retryRequest, true)
  }

  const backUrl = routeTarget.domainId || returnTo === 'units'
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
              {message.role === 'assistant' && message.sources?.length ? (
                <ul className="chat-sources" aria-label="Supporting study materials">
                  {message.sources.map((source) => <li key={source.id}>{source.label}</li>)}
                </ul>
              ) : null}
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
          <div className="chat-attachment-row">
            <input
              ref={attachmentInputRef}
              id="chat-attachment"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={selectAttachment}
            />
            <button type="button" className="chat-attachment-button" disabled={state.status === 'loading' || isUploading} onClick={() => attachmentInputRef.current?.click()}>
              Attach homework photo
            </button>
            {attachment ? (
              <div className="chat-attachment-preview">
                <img src={attachment.previewUrl} alt="Homework photo ready to send" />
                <span>{attachment.file.name}</span>
                <button type="button" onClick={clearAttachment}>Remove</button>
              </div>
            ) : null}
            {attachmentError ? (
              <p className="chat-attachment-error" role="alert">
                {attachmentError}
                {authStatus !== 'signed-in' ? (
                  <button type="button" disabled={isAuthenticating} onClick={signIn}>
                    {isAuthenticating ? 'Signing in…' : 'Sign in with Google'}
                  </button>
                ) : null}
              </p>
            ) : null}
          </div>
          <div>
            <span>{isUploading ? 'Uploading photo…' : `${draft.length}/1200`}</span>
            <button type="submit" disabled={!draft.trim() || state.status === 'loading' || isUploading}>Send</button>
          </div>
        </form>
      </section>
    </main>
  )
}
