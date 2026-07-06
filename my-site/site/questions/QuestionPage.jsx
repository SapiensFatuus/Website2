import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getAvailableFilterGroups,
  getDefaultFilterSelections,
  getFilterOptionLabel,
  getQuestions,
  getQuestionsByIds,
  getReportingGroup,
  reconcileFilterSelections,
} from './questionData'
import {
  advancePracticeSession,
  answeredCount,
  completeSession,
  createSession,
  formatDuration,
  getElapsedSeconds,
  getMaterialPercent,
  getOrderedOptions,
  getQuestionTimeSeconds,
  getScoreBand,
  gradeSession,
  isRestorableSession,
  moveToQuestion,
  normalizeSession,
  progressPercent,
  setSessionVisibility,
  sortReviewQuestions,
} from './questionEngine'
import './QuestionPage.css'

const STORAGE_KEY = 'study-ai-question-session-v1'
const DEFAULT_SETTINGS = {
  mode: 'practice',
  filters: {},
  questionCount: '5',
  timerEnabled: false,
  timerMinutes: '10',
}

function readSavedSession(topicSlug) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    return isRestorableSession(saved, topicSlug) ? saved : null
  } catch {
    return null
  }
}

function SetupModal({ topic, initialFilters, savedSession, onResume, onCancel, onStart }) {
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    filters: reconcileFilterSelections(topic, {
      ...getDefaultFilterSelections(topic),
      ...initialFilters,
    }),
  }))
  const [error, setError] = useState('')
  const titleRef = useRef(null)
  const modalRef = useRef(null)
  const filterGroups = useMemo(
    () => getAvailableFilterGroups(topic, settings.filters),
    [topic, settings.filters],
  )
  const matchingQuestions = useMemo(
    () => getQuestions({ topic: topic.slug, filters: settings.filters }),
    [topic.slug, settings.filters],
  )

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })

    function keepFocusInside(event) {
      if (event.key === 'Escape') {
        onCancel()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = [...modalRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', keepFocusInside)
    return () => document.removeEventListener('keydown', keepFocusInside)
  }, [onCancel])

  function updateSetting(name, value) {
    setError('')
    setSettings((current) => ({ ...current, [name]: value }))
  }

  function updateFilter(group, optionId) {
    setError('')
    setSettings((current) => {
      const currentValues = current.filters[group.id] || []
      const nextValues = group.selection === 'single'
        ? [optionId]
        : currentValues.includes(optionId)
          ? currentValues.filter((item) => item !== optionId)
          : [...currentValues, optionId]
      const filters = reconcileFilterSelections(topic, {
        ...current.filters,
        [group.id]: nextValues,
      })
      const availableCount = getQuestions({ topic: topic.slug, filters }).length
      const questionCount = current.questionCount !== 'all' && Number(current.questionCount) > availableCount
        ? 'all'
        : current.questionCount

      return { ...current, filters, questionCount }
    })
  }

  function submit(event) {
    event.preventDefault()
    const count = settings.mode === 'practice' || settings.questionCount === 'all'
      ? matchingQuestions.length
      : Number(settings.questionCount)
    const timerMinutes = settings.timerEnabled ? Number(settings.timerMinutes) : null

    if (!matchingQuestions.length) {
      setError('No questions match these filters yet.')
      return
    }

    if (settings.mode === 'testing' && (!Number.isInteger(count) || count < 1 || count > matchingQuestions.length)) {
      setError(`Choose between 1 and ${matchingQuestions.length} questions.`)
      return
    }

    if (settings.timerEnabled && (!Number.isFinite(timerMinutes) || timerMinutes < 1 || timerMinutes > 300)) {
      setError('Choose a time limit between 1 and 300 minutes.')
      return
    }

    onStart({
      topic: topic.slug,
      mode: settings.mode,
      filters: settings.filters,
      reportingGroupId: getReportingGroup(topic)?.id || 'material',
      questionCount: settings.mode === 'practice' || settings.questionCount === 'all' ? 'all' : count,
      timerMinutes,
    }, matchingQuestions)
  }

  return (
    <div className="question-modal-backdrop">
      <section ref={modalRef} className="question-modal" role="dialog" aria-modal="true" aria-labelledby="setup-title">
        <div className="question-modal-heading">
          <div>
            <p className="question-eyebrow">{topic.title}</p>
            <h1 id="setup-title" ref={titleRef} tabIndex="-1">Build your question set</h1>
          </div>
          <button type="button" className="question-icon-button" onClick={onCancel} aria-label="Close setup">×</button>
        </div>

        {savedSession ? (
          <div className="resume-card">
            <div>
              <strong>Unfinished session found</strong>
              <span>{answeredCount(savedSession)} of {savedSession.questionIds.length} answered</span>
            </div>
            <button type="button" className="question-secondary-button" onClick={onResume}>Resume</button>
          </div>
        ) : null}

        <form onSubmit={submit}>
          <fieldset className="setting-group">
            <legend>Mode</legend>
            <div className="choice-grid choice-grid-two">
              <label className={`setting-choice${settings.mode === 'practice' ? ' selected' : ''}`}>
                <input type="radio" name="mode" value="practice" checked={settings.mode === 'practice'} onChange={() => updateSetting('mode', 'practice')} />
                <strong>Practice</strong>
                <span>Submit and review each answer immediately.</span>
              </label>
              <label className={`setting-choice${settings.mode === 'testing' ? ' selected' : ''}`}>
                <input type="radio" name="mode" value="testing" checked={settings.mode === 'testing'} onChange={() => updateSetting('mode', 'testing')} />
                <strong>Testing</strong>
                <span>Review answers only after the full test.</span>
              </label>
            </div>
          </fieldset>

          {filterGroups.map((group) => {
            const selectedValues = settings.filters[group.id] || []
            const isSingle = group.selection === 'single'
            return (
              <fieldset className="setting-group" key={group.id}>
                <legend>{group.label}</legend>
                {!isSingle ? <p className="setting-help">Leave everything unchecked to include all available options.</p> : null}
                <div className={isSingle ? 'choice-grid choice-grid-two' : 'filter-chips'}>
                  {group.options.map((option) => (
                    <label className={`${isSingle ? 'setting-choice' : 'filter-chip'}${selectedValues.includes(option.id) ? ' selected' : ''}`} key={option.id}>
                      <input
                        type={isSingle ? 'radio' : 'checkbox'}
                        name={`filter-${group.id}`}
                        checked={selectedValues.includes(option.id)}
                        onChange={() => updateFilter(group, option.id)}
                      />
                      {isSingle ? <strong>{option.label}</strong> : option.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            )
          })}

          <p className="filter-match-count" role="status">
            {matchingQuestions.length
              ? `${matchingQuestions.length} question${matchingQuestions.length === 1 ? '' : 's'} match the current filters.`
              : 'No currently supported questions are available for this topic.'}
          </p>

          {settings.mode === 'testing' ? (
            <fieldset className="setting-group">
              <legend>Number of questions</legend>
              <div className="count-options">
                {['5', '10', '20'].map((count) => (
                  <label className={`count-choice${settings.questionCount === count ? ' selected' : ''}${Number(count) > matchingQuestions.length ? ' disabled' : ''}`} key={count}>
                    <input type="radio" name="count" value={count} disabled={Number(count) > matchingQuestions.length} checked={settings.questionCount === count} onChange={() => updateSetting('questionCount', count)} />
                    {count}
                  </label>
                ))}
                <label className={`count-choice${settings.questionCount === 'all' ? ' selected' : ''}`}>
                  <input type="radio" name="count" checked={settings.questionCount === 'all'} onChange={() => updateSetting('questionCount', 'all')} />
                  All ({matchingQuestions.length})
                </label>
                <label className="custom-count">
                  <span>Custom</span>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, matchingQuestions.length)}
                    aria-label="Custom number of questions"
                    value={typeof settings.questionCount === 'number' ? settings.questionCount : ''}
                    onChange={(event) => updateSetting('questionCount', Number(event.target.value))}
                    onFocus={() => {
                      if (typeof settings.questionCount !== 'number') updateSetting('questionCount', 1)
                    }}
                  />
                </label>
              </div>
            </fieldset>
          ) : matchingQuestions.length ? (
            <p className="practice-all-note">Practice includes all {matchingQuestions.length} matching questions in random order. Finish whenever you are ready.</p>
          ) : null}

          <fieldset className="setting-group timer-setting">
            <legend>Time limit</legend>
            <label className="toggle-row">
              <input type="checkbox" checked={settings.timerEnabled} onChange={(event) => updateSetting('timerEnabled', event.target.checked)} />
              <span>Use a countdown timer</span>
            </label>
            {settings.timerEnabled ? (
              <label className="timer-input">
                <span>Minutes</span>
                <input type="number" min="1" max="300" value={settings.timerMinutes} onChange={(event) => updateSetting('timerMinutes', event.target.value)} />
              </label>
            ) : null}
          </fieldset>

          {error ? <p className="setup-error" role="alert">{error}</p> : null}

          <div className="modal-actions">
            <button type="button" className="question-secondary-button" onClick={onCancel}>Cancel</button>
            <button type="submit" className="question-primary-button" disabled={!matchingQuestions.length}>Start {settings.mode === 'testing' ? 'test' : 'practice'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

function ResultsView({ session, questions, topic, onNewSession, onRetry, onExit }) {
  const [sortKey, setSortKey] = useState('order')
  const [sortDirection, setSortDirection] = useState('asc')
  const grade = gradeSession(session, questions)
  const elapsed = getElapsedSeconds(session)
  const scoreBand = getScoreBand(grade.percent)
  const originalOrder = new Map(session.questionIds.map((id, index) => [id, index]))
  const detailsById = new Map(grade.details.map((detail) => [detail.questionId, detail]))
  const includedQuestionIds = new Set(grade.details.map((detail) => detail.questionId))
  const reviewQuestions = questions.filter((question) => includedQuestionIds.has(question.id))
  const sortedQuestions = sortReviewQuestions(reviewQuestions, session, grade.details, sortKey, sortDirection)
  const reportingGroup = getReportingGroup(topic)

  return (
    <main className="results-page">
      <section className="results-hero">
        <p className="question-eyebrow">{topic.title} · {session.config.mode === 'testing' ? 'Test' : 'Practice'} complete</p>
        <h1 className={`score-${scoreBand}`}>{grade.percent}%</h1>
        <p>{grade.total ? `${grade.correct} correct out of ${grade.total}` : 'No graded answers'}</p>
        <div className="result-stat-grid">
          <div><strong>{grade.correct}</strong><span>Correct</span></div>
          <div><strong>{grade.incorrect}</strong><span>Incorrect</span></div>
          {session.config.mode === 'practice' ? (
            <div><strong>{grade.skipped}</strong><span>Skipped</span></div>
          ) : (
            <div><strong>{grade.unanswered}</strong><span>Unanswered</span></div>
          )}
          <div><strong>{formatDuration(elapsed)}</strong><span>Time</span></div>
        </div>
      </section>

      <section className="result-section">
        <h2>Performance by material</h2>
        <div className="material-results">
          {Object.keys(grade.byMaterial).length ? Object.entries(grade.byMaterial).map(([material, result]) => {
            const materialPercent = getMaterialPercent(result)
            return (
              <div className="material-result" key={material}>
                <div className="material-result-copy">
                  <strong>{getFilterOptionLabel(topic, reportingGroup?.id || 'material', material)}</strong>
                  <span>{result.correct} of {result.total} correct</span>
                </div>
                <div className="material-progress" role="progressbar" aria-label={`${material} score`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={materialPercent}>
                  <span className={`score-bg-${getScoreBand(materialPercent)}`} style={{ width: `${materialPercent}%` }} />
                </div>
              </div>
            )
          }) : <p className="no-material-results">No graded material results yet.</p>}
        </div>
      </section>

      <section className="result-section">
        <div className="review-toolbar">
          <h2>Answer review</h2>
          <label>
            <span>Sort by</span>
            <select value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
              <option value="order">Question order</option>
              <option value="material">Material</option>
              <option value="status">Right or wrong</option>
              <option value="time">Time spent</option>
            </select>
          </label>
          <button
            type="button"
            className="question-secondary-button sort-direction"
            onClick={() => setSortDirection((current) => current === 'asc' ? 'desc' : 'asc')}
            aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortDirection === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
          </button>
        </div>
        <div className="review-list">
          {sortedQuestions.map((question) => {
            const index = originalOrder.get(question.id)
            const detail = detailsById.get(question.id)
            const selectedId = session.answers[question.id]
            const selected = question.options?.find((option) => option.id === selectedId)
            const correct = question.options?.find((option) => option.id === question.correctOptionId)
            const wasSubmitted = session.config.mode === 'testing' || session.submitted[question.id]
            const wasSkipped = Boolean(session.skipped?.[question.id])
            const isCorrect = Boolean(detail?.isCorrect)
            const orderedOptions = getOrderedOptions(question, session)
            const timeSpent = getQuestionTimeSeconds(session, question.id)
            const categoryLabels = (question.classifications[reportingGroup?.id || 'material'] || [])
              .map((value) => getFilterOptionLabel(topic, reportingGroup?.id || 'material', value))
              .join(', ') || 'Uncategorized'
            return (
              <article className={`review-card ${wasSkipped ? 'skipped' : isCorrect ? 'correct' : selectedId && wasSubmitted ? 'incorrect' : 'unanswered'}`} key={question.id}>
                <div className="review-heading">
                  <span>Question {index + 1} · {categoryLabels}{session.flagged[question.id] ? ' · Flagged' : ''}</span>
                  <strong>{wasSkipped ? 'Skipped' : isCorrect ? 'Correct' : selectedId && wasSubmitted ? 'Incorrect' : 'Unanswered'}</strong>
                </div>
                <h3>{question.prompt}</h3>
                <p className="review-time"><b>Active time:</b> {formatDuration(timeSpent)}</p>
                {question.renderer === 'multiple-choice' ? <ol className="review-options" type="A">
                  {orderedOptions.map((option) => (
                    <li className={`${option.id === correct?.id ? 'correct' : ''}${wasSubmitted && option.id === selected?.id ? ' selected' : ''}`} key={option.id}>
                      {option.text}
                      {option.id === correct?.id ? ' — Correct answer' : ''}
                      {wasSubmitted && !wasSkipped && option.id === selected?.id ? ' — Your answer' : ''}
                    </li>
                  ))}
                </ol> : !wasSkipped && !detail?.isUnanswered ? (
                  <div className="review-response">
                    <strong>Your response</strong>
                    <p>{selectedId}</p>
                    {question.renderer === 'grid-in' ? <p><b>Correct answer:</b> {question.correctAnswer}</p> : null}
                  </div>
                ) : null}
                {wasSkipped ? <p><b>Your answer:</b> Skipped without answering</p> : null}
                {detail?.isUnanswered ? <p><b>Your answer:</b> No submitted answer</p> : null}
                <p className="review-explanation">{question.explanation}</p>
              </article>
            )
          })}
        </div>
      </section>

      <div className="results-actions">
        <button type="button" className="question-primary-button" onClick={onRetry}>Try these settings again</button>
        <button type="button" className="question-secondary-button" onClick={onNewSession}>New settings</button>
        <button type="button" className="question-text-button" onClick={onExit}>Return to topic</button>
      </div>
    </main>
  )
}

function FlaggedReviewModal({ flaggedCount, onReview, onSubmit, onCancel }) {
  const headingRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onCancel()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...modalRef.current.querySelectorAll('button:not([disabled])')]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="question-modal-backdrop compact">
      <section ref={modalRef} className="flag-review-modal" role="dialog" aria-modal="true" aria-labelledby="flag-review-title">
        <h2 id="flag-review-title" ref={headingRef} tabIndex="-1">Review flagged questions?</h2>
        <p>You flagged {flaggedCount} question{flaggedCount === 1 ? '' : 's'}. You can review them before submitting your test.</p>
        <div className="flag-review-actions">
          <button type="button" className="question-primary-button" onClick={onReview}>Review Flagged</button>
          <button type="button" className="question-secondary-button" onClick={onSubmit}>Submit Anyway</button>
          <button type="button" className="question-text-button" onClick={onCancel}>Cancel</button>
        </div>
      </section>
    </div>
  )
}

export function QuestionPage({ topic, initialFilters = {}, onNavigate }) {
  const [savedSession, setSavedSession] = useState(() => topic ? readSavedSession(topic.slug) : null)
  const [session, setSession] = useState(null)
  const [setupOpen, setSetupOpen] = useState(true)
  const [now, setNow] = useState(0)
  const [navigatorExpanded, setNavigatorExpanded] = useState(true)
  const [flagReviewOpen, setFlagReviewOpen] = useState(false)

  const questions = useMemo(
    () => session ? getQuestionsByIds(session.questionIds) : [],
    [session],
  )
  const currentQuestion = session ? questions[session.currentIndex] : null
  const selectedOptionId = currentQuestion ? session.answers[currentQuestion.id] : null
  const isCurrentSubmitted = currentQuestion ? Boolean(session.submitted[currentQuestion.id]) : false
  const isPractice = session?.config.mode === 'practice'

  useEffect(() => {
    if (!session || session.status !== 'active') return undefined
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))

    function warnBeforeUnload(event) {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warnBeforeUnload)
    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [session])

  useEffect(() => {
    if (!session || session.status !== 'active') return undefined

    function handleVisibilityChange() {
      const nextNow = Date.now()
      setNow(nextNow)
      setSession((current) => setSessionVisibility(current, document.visibilityState === 'visible', nextNow))
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [session])

  useEffect(() => {
    if (!session || session.status !== 'active') return undefined
    const interval = window.setInterval(() => {
      const nextNow = Date.now()
      setNow(nextNow)
      setSession((current) => {
        if (!current?.deadline || current.status !== 'active' || nextNow < current.deadline) return current
        return completeSession(current, 'time-expired', nextNow)
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [session])

  useEffect(() => {
    if (session?.status === 'complete') {
      window.localStorage.removeItem(STORAGE_KEY)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [session?.status])

  if (!topic) {
    return (
      <main className="question-empty-page">
        <h1>Topic not found</h1>
        <p>This question set does not have a valid topic.</p>
        <button type="button" className="question-primary-button" onClick={() => onNavigate('/index.html')}>Return home</button>
      </main>
    )
  }

  function navigateToTopic(skipWarning = false) {
    if (!skipWarning && session?.status === 'active' && !window.confirm('Leave this session? Your progress is saved and can be resumed later.')) return
    onNavigate(`/topic.html?topic=${topic.slug}`)
  }

  function startSession(config, matchingQuestions) {
    if (savedSession && !window.confirm('Starting a new session will replace the saved one. Continue?')) return
    const nextSession = createSession(config, matchingQuestions)
    setNow(nextSession.startedAt)
    setSession(nextSession)
    setSavedSession(null)
    setSetupOpen(false)
    setNavigatorExpanded(nextSession.questionIds.length <= 20)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function resumeSession() {
    const resumeNow = Date.now()
    const savedQuestions = getQuestionsByIds(savedSession.questionIds)
    const normalized = normalizeSession(savedSession, savedQuestions, Math.random, resumeNow)
    setNow(resumeNow)
    setSession(normalized)
    setSavedSession(null)
    setSetupOpen(false)
    setNavigatorExpanded(normalized.questionIds.length <= 20)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function retrySession() {
    const matchingQuestions = getQuestions({
      topic: session.config.topic,
      filters: session.config.filters,
    })
    const nextSession = createSession(session.config, matchingQuestions)
    setNow(nextSession.startedAt)
    setSession(nextSession)
    setSetupOpen(false)
    setNavigatorExpanded(nextSession.questionIds.length <= 20)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function updateSession(updater) {
    setSession((current) => updater(current))
  }

  function selectAnswer(optionId) {
    if (!currentQuestion || (isPractice && isCurrentSubmitted)) return
    if (session.eliminated[currentQuestion.id]?.includes(optionId)) return
    updateSession((current) => ({
      ...current,
      answers: { ...current.answers, [currentQuestion.id]: optionId },
    }))
  }

  function updateTypedAnswer(value) {
    if (!currentQuestion || (isPractice && isCurrentSubmitted)) return
    updateSession((current) => ({
      ...current,
      answers: { ...current.answers, [currentQuestion.id]: value },
    }))
  }

  function toggleEliminated(optionId) {
    if (!currentQuestion || (isPractice && isCurrentSubmitted)) return
    updateSession((current) => {
      const currentEliminated = current.eliminated[currentQuestion.id] || []
      const nextEliminated = currentEliminated.includes(optionId)
        ? currentEliminated.filter((id) => id !== optionId)
        : [...currentEliminated, optionId]
      const answers = { ...current.answers }
      if (nextEliminated.includes(answers[currentQuestion.id])) delete answers[currentQuestion.id]
      return {
        ...current,
        answers,
        eliminated: { ...current.eliminated, [currentQuestion.id]: nextEliminated },
      }
    })
  }

  function submitPracticeAnswer() {
    if (!selectedOptionId) return
    updateSession((current) => ({
      ...current,
      submitted: { ...current.submitted, [currentQuestion.id]: true },
    }))
  }

  function submitSession() {
    const unanswered = session.questionIds.length - answeredCount(session)
    const message = unanswered
      ? `You have ${unanswered} unanswered question${unanswered === 1 ? '' : 's'}. Submit anyway?`
      : `Submit this ${isPractice ? 'practice session' : 'test'} for final results?`
    if (!window.confirm(message)) return
    setSession((current) => completeSession(current))
  }

  function finishSession() {
    if (isPractice) {
      const attempted = Object.keys(session.submitted).length + Object.keys(session.skipped || {}).length
      if (!attempted && !window.confirm('Finish practice without submitting or skipping any questions?')) return
      setSession((current) => completeSession(current))
      return
    }
    const flaggedIds = session.questionIds.filter((id) => session.flagged[id])
    if (!isPractice && flaggedIds.length) {
      setFlagReviewOpen(true)
      return
    }
    submitSession()
  }

  function advancePractice(skip = false) {
    const nextNow = now || session.startedAt
    setNow(nextNow)
    setSession((current) => advancePracticeSession(
      current,
      { skip },
      nextNow,
      document.visibilityState === 'visible',
    ))
  }

  function reviewFlaggedQuestions() {
    const firstFlaggedIndex = session.questionIds.findIndex((id) => session.flagged[id])
    setFlagReviewOpen(false)
    setNavigatorExpanded(true)
    if (firstFlaggedIndex >= 0) {
      const nextNow = Date.now()
      setNow(nextNow)
      setSession((current) => moveToQuestion(current, firstFlaggedIndex, nextNow, document.visibilityState === 'visible'))
    }
  }

  function submitFlaggedTest() {
    setFlagReviewOpen(false)
    submitSession()
  }

  function goToQuestion(index) {
    if (isPractice && !isCurrentSubmitted && index !== session.currentIndex) return
    const nextNow = now || session.startedAt
    setNow(nextNow)
    setSession((current) => moveToQuestion(current, index, nextNow, document.visibilityState === 'visible'))
  }

  function resetToSetup() {
    setSession(null)
    setSavedSession(null)
    setSetupOpen(true)
    setFlagReviewOpen(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  if (setupOpen) {
    return (
      <div className="question-setup-page">
        <SetupModal
          topic={topic}
          initialFilters={initialFilters}
          savedSession={savedSession}
          onResume={resumeSession}
          onCancel={() => navigateToTopic(true)}
          onStart={startSession}
        />
      </div>
    )
  }

  if (session?.status === 'complete') {
    return (
      <ResultsView
        session={session}
        questions={questions}
        topic={topic}
        onNewSession={resetToSetup}
        onRetry={retrySession}
        onExit={() => navigateToTopic(true)}
      />
    )
  }

  if (isPractice && session.practicePoolExhausted) {
    const submittedCount = Object.keys(session.submitted).length
    const skippedCount = Object.keys(session.skipped || {}).length
    return (
      <main className="practice-pool-end">
        <p className="question-eyebrow">{topic.title} · Practice</p>
        <h1>You have seen every matching question.</h1>
        <p>{submittedCount} answered · {skippedCount} skipped</p>
        <div className="practice-pool-actions">
          <button type="button" className="question-primary-button" onClick={() => setSession((current) => completeSession(current))}>View Summary</button>
          <button type="button" className="question-secondary-button" onClick={retrySession}>Restart Practice</button>
        </div>
      </main>
    )
  }

  const eliminatedOptions = session.eliminated[currentQuestion.id] || []
  const correctOptionId = currentQuestion.correctOptionId
  const remainingSeconds = session.deadline
    ? Math.max(0, Math.ceil((session.deadline - now) / 1000))
    : null
  const answered = answeredCount(session)
  const percent = progressPercent(session)
  const orderedOptions = getOrderedOptions(currentQuestion, session)
  const normalizedCurrentAnswer = String(selectedOptionId ?? '').trim()
  const currentAnswerIsCorrect = currentQuestion.renderer === 'grid-in'
    ? normalizedCurrentAnswer === String(currentQuestion.correctAnswer).trim()
    : currentQuestion.renderer === 'free-response'
      ? false
      : selectedOptionId === correctOptionId
  const reportingGroup = getReportingGroup(topic)
  const currentCategoryLabels = (currentQuestion.classifications[reportingGroup?.id || 'material'] || [])
    .map((value) => getFilterOptionLabel(topic, reportingGroup?.id || 'material', value))
    .join(', ') || 'Uncategorized'

  return (
    <div className="question-session-page">
      <header className="question-session-header">
        <button type="button" className="question-text-button question-exit" onClick={() => navigateToTopic()}>← Exit</button>
        <div className="session-heading">
          <strong>{topic.title}</strong>
          <span>{isPractice ? 'Practice mode' : 'Testing mode'}</span>
        </div>
        <div className="session-header-actions">
          <div className={`session-timer${remainingSeconds !== null && remainingSeconds < 60 ? ' urgent' : ''}`} aria-live="polite">
            {remainingSeconds === null ? `Elapsed ${formatDuration(getElapsedSeconds(session, now))}` : `Time ${formatDuration(remainingSeconds)}`}
          </div>
          {isPractice ? (
            <button type="button" className="header-finish-button" onClick={finishSession}>Finish Practice</button>
          ) : null}
        </div>
      </header>

      {!isPractice ? (
        <div className="question-progress-wrap">
          <div className="question-progress-copy">
            <span>{answered} of {session.questionIds.length} answered</span>
            <strong>{percent}%</strong>
          </div>
          <div className="question-progress" role="progressbar" aria-label="Questions answered" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>
      ) : null}

      {!isPractice ? <section className={`question-navigator${navigatorExpanded ? ' expanded' : ' collapsed'}`} aria-label="Question navigator">
        <div className="navigator-heading">
          <div>
            <h2>Question summary</h2>
            <span>{answered} answered · {session.questionIds.filter((id) => session.flagged[id]).length} flagged</span>
          </div>
          <div className="navigator-actions">
            <button type="button" className="question-text-button" aria-expanded={navigatorExpanded} onClick={() => setNavigatorExpanded((current) => !current)}>
              {navigatorExpanded ? 'Hide questions' : 'Show questions'}
            </button>
            <button type="button" className="question-primary-button compact" onClick={finishSession}>Finish test</button>
          </div>
        </div>
        {navigatorExpanded ? (
          <>
            <div className="navigator-grid">
              {session.questionIds.map((questionId, index) => {
                const question = questions[index]
                const submitted = Boolean(session.submitted[questionId])
                const correct = submitted && session.answers[questionId] === question.correctOptionId
                const incorrect = submitted && session.answers[questionId] !== question.correctOptionId
                const navClasses = [
                  'navigator-item',
                  index === session.currentIndex ? 'current' : '',
                  session.answers[questionId] ? 'answered' : '',
                  correct ? 'correct' : '',
                  incorrect ? 'incorrect' : '',
                  session.flagged[questionId] ? 'flagged' : '',
                ].filter(Boolean).join(' ')
                return (
                  <button
                    type="button"
                    className={navClasses}
                    disabled={isPractice && !isCurrentSubmitted && index !== session.currentIndex}
                    aria-label={`Question ${index + 1}${session.answers[questionId] ? ', answered' : ', unanswered'}${correct ? ', correct' : ''}${incorrect ? ', incorrect' : ''}${session.flagged[questionId] ? ', flagged' : ''}`}
                    aria-current={index === session.currentIndex ? 'step' : undefined}
                    onClick={() => goToQuestion(index)}
                    key={questionId}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
            <div className="navigator-key">
              <span><i className="key-dot answered" /> Answered</span>
              <span><i className="key-dot flagged" /> Flagged</span>
            </div>
          </>
        ) : null}
      </section> : null}

      <main className="question-layout">
        <section className="question-card" aria-labelledby="question-prompt">
          <div className="question-card-meta">
            <span>{isPractice ? 'Practice question' : `Question ${session.currentIndex + 1} of ${session.questionIds.length}`}</span>
            <span>{currentCategoryLabels}</span>
            <button
              type="button"
              className={`flag-button${session.flagged[currentQuestion.id] ? ' active' : ''}`}
              aria-pressed={Boolean(session.flagged[currentQuestion.id])}
              onClick={() => updateSession((current) => ({
                ...current,
                flagged: { ...current.flagged, [currentQuestion.id]: !current.flagged[currentQuestion.id] },
              }))}
            >
              ⚑ {session.flagged[currentQuestion.id] ? 'Flagged' : 'Flag for review'}
            </button>
          </div>
          <h1 id="question-prompt">{currentQuestion.prompt}</h1>
          <p className="answer-instruction">
            {currentQuestion.renderer === 'multiple-choice'
              ? 'Select an answer. Use the eye-slash button to eliminate choices.'
              : currentQuestion.renderer === 'grid-in'
                ? 'Enter your answer in the box below.'
                : 'Write your response in the box below. Automated FRQ grading is coming later.'}
          </p>

          {currentQuestion.renderer === 'multiple-choice' ? <div className="answer-options" role="radiogroup" aria-labelledby="question-prompt">
            {orderedOptions.map((option, optionIndex) => {
              const eliminated = eliminatedOptions.includes(option.id)
              const selected = selectedOptionId === option.id
              const showResult = isPractice && isCurrentSubmitted
              const isCorrect = showResult && option.id === correctOptionId
              const isIncorrect = showResult && selected && option.id !== correctOptionId
              const classes = [
                'answer-option',
                selected ? 'selected' : '',
                eliminated ? 'eliminated' : '',
                isCorrect ? 'correct' : '',
                isIncorrect ? 'incorrect' : '',
              ].filter(Boolean).join(' ')
              return (
                <div className={classes} key={option.id}>
                  <button
                    type="button"
                    className="answer-select"
                    role="radio"
                    aria-checked={selected}
                    disabled={eliminated || (isPractice && isCurrentSubmitted)}
                    onClick={() => selectAnswer(option.id)}
                  >
                    <span className="answer-letter">{String.fromCharCode(65 + optionIndex)}</span>
                    <span>{option.text}</span>
                    {isCorrect ? <b className="answer-status">Correct</b> : null}
                    {isIncorrect ? <b className="answer-status">Your answer</b> : null}
                  </button>
                  <button
                    type="button"
                    className="eliminate-button"
                    aria-label={`${eliminated ? 'Restore' : 'Eliminate'} option ${String.fromCharCode(65 + optionIndex)}`}
                    aria-pressed={eliminated}
                    disabled={isPractice && isCurrentSubmitted}
                    onClick={() => toggleEliminated(option.id)}
                  >
                    {eliminated ? '↶' : '◉̸'}
                  </button>
                </div>
              )
            })}
          </div> : (
            <div className={`typed-answer ${currentQuestion.renderer}`}>
              <label htmlFor="typed-response">{currentQuestion.renderer === 'grid-in' ? 'Your answer' : 'Your response'}</label>
              {currentQuestion.renderer === 'grid-in' ? (
                <input
                  id="typed-response"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={selectedOptionId || ''}
                  disabled={isPractice && isCurrentSubmitted}
                  onChange={(event) => updateTypedAnswer(event.target.value)}
                />
              ) : (
                <textarea
                  id="typed-response"
                  rows="8"
                  value={selectedOptionId || ''}
                  disabled={isPractice && isCurrentSubmitted}
                  onChange={(event) => updateTypedAnswer(event.target.value)}
                />
              )}
              <p>{currentQuestion.renderer === 'grid-in' ? 'Exact-match grading ignores spaces at the beginning and end.' : 'Your response will be saved, but it will be marked incorrect in this first version.'}</p>
            </div>
          )}

          <div className="question-actions">
            {isPractice ? !isCurrentSubmitted ? (
              <>
                <button type="button" className="question-secondary-button" onClick={() => advancePractice(true)}>Skip Question</button>
                <button type="button" className="question-primary-button" disabled={!selectedOptionId} onClick={submitPracticeAnswer}>Submit Answer</button>
              </>
            ) : (
              <>
                <button type="button" className="question-primary-button" onClick={() => advancePractice(false)}>{session.currentIndex === session.questionIds.length - 1 ? 'Continue' : 'Next Question'}</button>
              </>
            ) : (
              <>
                <button type="button" className="question-secondary-button" disabled={session.currentIndex === 0} onClick={() => goToQuestion(session.currentIndex - 1)}>Previous</button>
                {session.currentIndex < session.questionIds.length - 1 ? (
                  <button type="button" className="question-primary-button" onClick={() => goToQuestion(session.currentIndex + 1)}>Next Question</button>
                ) : (
                  <button type="button" className="question-primary-button" onClick={finishSession}>Submit Test</button>
                )}
              </>
            )}
          </div>

          {isPractice && isCurrentSubmitted ? (
            <div className={`answer-feedback${currentAnswerIsCorrect ? ' correct' : ' incorrect'}`} role="status">
              <strong>{currentAnswerIsCorrect ? 'Correct!' : currentQuestion.renderer === 'free-response' ? 'Response saved.' : 'Not quite.'}</strong>
              <p>{currentQuestion.explanation}</p>
            </div>
          ) : null}
        </section>
      </main>

      {flagReviewOpen ? (
        <FlaggedReviewModal
          flaggedCount={session.questionIds.filter((id) => session.flagged[id]).length}
          onReview={reviewFlaggedQuestions}
          onSubmit={submitFlaggedTest}
          onCancel={() => setFlagReviewOpen(false)}
        />
      ) : null}
    </div>
  )
}
