import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { canPersistLearningRecords } from '../auth/authState'
import { createPersistenceFingerprint } from '../learning/learningIds.js'
import { persistLearningRecords } from '../learning/learningFirestore.js'
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
import { createFrqSelfReview } from './frqSelfReview.js'
import { getQuestionPersistencePolicy } from './questionPersistence.js'
import { clientEnvironment } from '../environment.js'
import { createFixedAssessmentSessionConfig } from '../content/fixedAssessmentSchema.js'
import './QuestionPage.css'

const STORAGE_KEY = 'study-ai-question-session-v1'
const DEFAULT_SETTINGS = {
  mode: 'practice',
  filters: {},
  questionCount: '5',
  timerEnabled: false,
  timerMinutes: '10',
}

function StimulusLineGraph({ representation }) {
  const width = 640
  const height = 300
  const inset = { left: 58, right: 24, top: 24, bottom: 48 }
  const points = representation.series.flatMap((series) => series.points)
  const xValues = points.map(([x]) => x)
  const yValues = points.map(([, y]) => y)
  const xMin = Math.min(...xValues)
  const xMax = Math.max(...xValues)
  const yMin = Math.min(0, ...yValues)
  const yMax = Math.max(...yValues)
  const xScale = (value) => inset.left + ((value - xMin) / (xMax - xMin || 1)) * (width - inset.left - inset.right)
  const yScale = (value) => height - inset.bottom - ((value - yMin) / (yMax - yMin || 1)) * (height - inset.top - inset.bottom)
  const rows = [...new Set(xValues)].sort((left, right) => left - right).map((x) => [
    x,
    ...representation.series.map((series) => series.points.find(([pointX]) => pointX === x)?.[1] ?? '—'),
  ])

  return (
    <div className="stimulus-line-graph">
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
        <line className="graph-axis" x1={inset.left} y1={inset.top} x2={inset.left} y2={height - inset.bottom} />
        <line className="graph-axis" x1={inset.left} y1={height - inset.bottom} x2={width - inset.right} y2={height - inset.bottom} />
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const y = inset.top + fraction * (height - inset.top - inset.bottom)
          const value = yMax - fraction * (yMax - yMin)
          return <g key={fraction}><line className="graph-grid" x1={inset.left} y1={y} x2={width - inset.right} y2={y} /><text x={inset.left - 9} y={y + 4} textAnchor="end">{value.toFixed(2)}</text></g>
        })}
        {rows.map(([value]) => {
          const x = xScale(value)
          return <g key={`x-${value}`}><line className="graph-grid" x1={x} y1={inset.top} x2={x} y2={height - inset.bottom} /><text x={x} y={height - inset.bottom + 18} textAnchor="middle">{value}</text></g>
        })}
        {representation.series.map((series, index) => {
          const color = series.color || ['#5c47a8', '#c94d62', '#187d6d'][index % 3]
          return <g key={series.label}><polyline fill="none" stroke={color} strokeWidth="4" points={series.points.map(([x, y]) => `${xScale(x)},${yScale(y)}`).join(' ')} />{series.points.map(([x, y]) => <circle cx={xScale(x)} cy={yScale(y)} r="4" fill={color} key={`${x}-${y}`} />)}</g>
        })}
        <text className="graph-label" x={(inset.left + width - inset.right) / 2} y={height - 9} textAnchor="middle">{representation.xLabel}</text>
        <text className="graph-label" transform={`translate(17 ${(inset.top + height - inset.bottom) / 2}) rotate(-90)`} textAnchor="middle">{representation.yLabel}</text>
      </svg>
      <div className="graph-legend" aria-hidden="true">{representation.series.map((series, index) => <span key={series.label}><i style={{ background: series.color || ['#5c47a8', '#c94d62', '#187d6d'][index % 3] }} />{series.label}</span>)}</div>
      <details className="graph-data-table">
        <summary>View exact graph data</summary>
        <div className="question-stimulus-table"><table><caption>{representation.caption} data</caption><thead><tr><th scope="col">{representation.xLabel}</th>{representation.series.map((series) => <th scope="col" key={series.label}>{series.label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={index}>{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
      </details>
    </div>
  )
}

function QuestionStimulus({ stimulus }) {
  if (!stimulus) return null
  const representation = stimulus.representation
  return (
    <aside className="question-stimulus" aria-labelledby={`stimulus-${stimulus.id}`}>
      <h2 id={`stimulus-${stimulus.id}`}>{stimulus.title}</h2>
      <p>{stimulus.context}</p>
      {representation.type === 'table' ? (
        <div className="question-stimulus-table"><table><caption>{representation.caption}</caption><thead><tr>{representation.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{representation.rows.map((row) => <tr key={row.join('|')}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={`${index}-${cell}`}>{cell}</td>)}</tr>)}</tbody></table></div>
      ) : representation.type === 'line-graph' ? <StimulusLineGraph representation={representation} /> : <p>{representation.accessibleDescription}</p>}
      <p className="sr-only">{representation.accessibleDescription}</p>
    </aside>
  )
}

function DraftRubric({ question }) {
  const [selectedPointIds, setSelectedPointIds] = useState([])
  const [exemplars, setExemplars] = useState([])
  useEffect(() => {
    let active = true
    if (question.topic !== 'ap-chemistry') return () => { active = false }
    import('../content/apChemistryFrqExemplars.js').then(({ getFrqExemplars }) => {
      if (active) setExemplars(getFrqExemplars(question.id, {
        editorialPreview: clientEnvironment.editorialPreview,
      }))
    }).catch(() => {
      if (active) setExemplars([])
    })
    return () => { active = false }
  }, [question.id, question.topic])
  if (!question.rubric) return null
  const selfReview = createFrqSelfReview(question.rubric, selectedPointIds)

  function togglePoint(pointId) {
    setSelectedPointIds((current) => (
      current.includes(pointId)
        ? current.filter((id) => id !== pointId)
        : [...current, pointId]
    ))
  }

  return (
    <details className="draft-rubric">
      <summary>Self-review with the draft model answer and {question.rubric.maxPoints}-point rubric</summary>
      <p className="self-review-disclaimer">{selfReview.disclaimer}</p>
      <h3>Model answer</h3><p>{question.modelAnswer}</p>
      <h3>Point-by-point self-check</h3>
      <p>Check a point only when your response contains the listed evidence. This draft rubric still requires chemistry-educator review.</p>
      {question.rubric.parts.map((part) => (
        <section key={part.id}>
          <h4>Part {part.id.replace('part-', '').toUpperCase()}</h4>
          <ul className="self-review-points">
            {part.points.map((point) => (
              <li key={point.id}>
                <label className="self-review-point">
                  <input
                    type="checkbox"
                    checked={selectedPointIds.includes(point.id)}
                    onChange={() => togglePoint(point.id)}
                  />
                  <span><strong>{point.criterion}</strong> {point.acceptableEvidence}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div className="self-review-summary" aria-live="polite">
        <strong>Self-check: {selfReview.earnedPoints} of {selfReview.maxPoints} draft points</strong>
        <span>{selfReview.message}</span>
      </div>
      {exemplars.length ? (
        <details className="frq-exemplars">
          <summary>Compare three original sample responses</summary>
          <p className="self-review-disclaimer">These AI-assisted examples illustrate different amounts of draft-rubric evidence. They are unreviewed, are not official AP responses, and do not assign a score to your work.</p>
          <div className="frq-exemplar-list">
            {exemplars.map((exemplar) => (
              <article key={exemplar.level}>
                <h4>{exemplar.level[0].toUpperCase() + exemplar.level.slice(1)} sample</h4>
                <p>{exemplar.response}</p>
                <p><strong>Draft evidence:</strong> {exemplar.earnedPointIds.length} of {question.rubric.maxPoints} listed criteria</p>
                <p><strong>Revision note:</strong> {exemplar.feedback}</p>
              </article>
            ))}
          </div>
        </details>
      ) : null}
    </details>
  )
}

function QuestionReferenceSupport({ question }) {
  const formulas = question.formulaReferences || []
  const priorKnowledge = question.referenceRequirements?.priorKnowledge || []
  if (!formulas.length && !priorKnowledge.length) return null

  return (
    <aside className="question-reference-support" aria-label="Reference support">
      <h3>Review the supporting relationships</h3>
      {formulas.length ? <ul>{formulas.map((formula) => (
        <li key={formula.id}><a href={formula.url}>{formula.title}</a></li>
      ))}</ul> : null}
      {priorKnowledge.length ? <p><strong>Prior knowledge used:</strong> {priorKnowledge.map((id) => id.replaceAll('-', ' ')).join('; ')}.</p> : null}
      <p className="self-review-disclaimer">Formula companions are original study resources. Their availability labels distinguish what is and is not separately supplied on the official exam reference information.</p>
    </aside>
  )
}

function readSavedSession(topicSlug) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    return isRestorableSession(saved, topicSlug) ? saved : null
  } catch {
    return null
  }
}

function restrictQuestionPool(questions, allowedQuestionIds) {
  if (!allowedQuestionIds?.length) return questions
  const allowed = new Set(allowedQuestionIds)
  return questions.filter(({ id }) => allowed.has(id))
}

function SetupModal({ topic, initialFilters, allowedQuestionIds, sessionLabel, sessionPreset, savedSession, onResume, onCancel, onStart }) {
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...(sessionPreset ? {
      mode: sessionPreset.mode,
      questionCount: 'all',
      timerEnabled: sessionPreset.timerMinutes !== null,
      timerMinutes: String(sessionPreset.timerMinutes ?? DEFAULT_SETTINGS.timerMinutes),
    } : {}),
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
    () => restrictQuestionPool(getQuestions({
      topic: topic.slug,
      filters: settings.filters,
      filterGroups: topic.questionFilters,
    }), allowedQuestionIds),
    [allowedQuestionIds, topic.questionFilters, topic.slug, settings.filters],
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
      const availableCount = restrictQuestionPool(getQuestions({ topic: topic.slug, filters }), allowedQuestionIds).length
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

    if (sessionPreset && matchingQuestions.length !== sessionPreset.questionIds.length) {
      setError('This fixed assessment is unavailable because one or more draft questions did not resolve.')
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

    const configurableSession = {
      topic: topic.slug,
      mode: settings.mode,
      filters: settings.filters,
      reportingGroupId: getReportingGroup(topic)?.id || 'material',
      questionCount: settings.mode === 'practice' || settings.questionCount === 'all' ? 'all' : count,
      timerMinutes,
    }
    onStart(sessionPreset
      ? createFixedAssessmentSessionConfig(sessionPreset, configurableSession)
      : configurableSession, matchingQuestions)
  }

  return (
    <div className="question-modal-backdrop">
      <section ref={modalRef} className="question-modal" role="dialog" aria-modal="true" aria-labelledby="setup-title">
        <div className="question-modal-heading">
          <div>
            <p className="question-eyebrow">{topic.title}</p>
            <h1 id="setup-title" ref={titleRef} tabIndex="-1">{sessionLabel || 'Build your question set'}</h1>
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

        {sessionPreset ? (
          <section className="assessment-blueprint-card" aria-labelledby="assessment-blueprint-heading">
            <h2 id="assessment-blueprint-heading">Fixed draft blueprint</h2>
            <p>{sessionPreset.description}</p>
            <dl>
              <div><dt>Questions</dt><dd>{sessionPreset.questionIds.length}</dd></div>
              <div><dt>Feedback</dt><dd>After submission</dd></div>
              <div><dt>Time</dt><dd>{sessionPreset.timerMinutes ? `${sessionPreset.timerMinutes} minutes` : 'Untimed'}</dd></div>
            </dl>
            <p className="self-review-disclaimer">{sessionPreset.scoringNotice}</p>
          </section>
        ) : null}

        <form onSubmit={submit}>
          <fieldset className="setting-group">
            <legend>Mode</legend>
            <div className="choice-grid choice-grid-two">
              <label className={`setting-choice${settings.mode === 'practice' ? ' selected' : ''}`}>
                <input type="radio" name="mode" value="practice" disabled={Boolean(sessionPreset)} checked={settings.mode === 'practice'} onChange={() => updateSetting('mode', 'practice')} />
                <strong>Practice</strong>
                <span>Submit and review each answer immediately.</span>
              </label>
              <label className={`setting-choice${settings.mode === 'testing' ? ' selected' : ''}`}>
                <input type="radio" name="mode" value="testing" disabled={Boolean(sessionPreset)} checked={settings.mode === 'testing'} onChange={() => updateSetting('mode', 'testing')} />
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
                        disabled={Boolean(sessionPreset)}
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
                    <input type="radio" name="count" value={count} disabled={Boolean(sessionPreset) || Number(count) > matchingQuestions.length} checked={settings.questionCount === count} onChange={() => updateSetting('questionCount', count)} />
                    {count}
                  </label>
                ))}
                <label className={`count-choice${settings.questionCount === 'all' ? ' selected' : ''}`}>
                  <input type="radio" name="count" disabled={Boolean(sessionPreset)} checked={settings.questionCount === 'all'} onChange={() => updateSetting('questionCount', 'all')} />
                  All ({matchingQuestions.length})
                </label>
                <label className="custom-count">
                  <span>Custom</span>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, matchingQuestions.length)}
                    aria-label="Custom number of questions"
                    disabled={Boolean(sessionPreset)}
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
              <input type="checkbox" disabled={Boolean(sessionPreset)} checked={settings.timerEnabled} onChange={(event) => updateSetting('timerEnabled', event.target.checked)} />
              <span>Use a countdown timer</span>
            </label>
            {settings.timerEnabled ? (
              <label className="timer-input">
                <span>Minutes</span>
                <input type="number" min="1" max="300" disabled={Boolean(sessionPreset)} value={settings.timerMinutes} onChange={(event) => updateSetting('timerMinutes', event.target.value)} />
              </label>
            ) : null}
          </fieldset>

          {error ? <p className="setup-error" role="alert">{error}</p> : null}

          <div className="modal-actions">
            <button type="button" className="question-secondary-button" onClick={onCancel}>Cancel</button>
            <button type="submit" className="question-primary-button" disabled={!matchingQuestions.length}>Start {sessionPreset?.startLabel || (settings.mode === 'testing' ? 'test' : 'practice')}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

function ResultsView({
  onRetrySave,
  questions,
  saveState,
  session,
  topic,
  onNewSession,
  onRetry,
  onExit,
  createResultSummary,
}) {
  const [sortKey, setSortKey] = useState('order')
  const [sortDirection, setSortDirection] = useState('asc')
  const grade = gradeSession(session, questions)
  const elapsed = getElapsedSeconds(session)
  const scoreBand = getScoreBand(grade.percent)
  const hasAutomaticScore = grade.total > 0
  const originalOrder = new Map(session.questionIds.map((id, index) => [id, index]))
  const detailsById = new Map(grade.details.map((detail) => [detail.questionId, detail]))
  const includedQuestionIds = new Set(grade.details.map((detail) => detail.questionId))
  const reviewQuestions = questions.filter((question) => includedQuestionIds.has(question.id))
  const sortedQuestions = sortReviewQuestions(reviewQuestions, session, grade.details, sortKey, sortDirection)
  const reportingGroup = getReportingGroup(topic)
  const customSummary = createResultSummary?.({ grade, questions, session }) || null

  return (
    <main className="results-page">
      <section className="results-hero">
        <p className="question-eyebrow">{session.config.assessmentTitle || `${topic.title} · ${session.config.mode === 'testing' ? 'Test' : 'Practice'}`} complete</p>
        <h1 className={hasAutomaticScore ? `score-${scoreBand}` : ''}>{hasAutomaticScore ? `${grade.percent}%` : grade.manualTotal ? 'Self-review' : '—'}</h1>
        <p>{hasAutomaticScore ? `${grade.correct} correct out of ${grade.total}` : grade.manualTotal ? `${grade.manualTotal} free response${grade.manualTotal === 1 ? '' : 's'} available for rubric self-check` : 'No graded answers'}</p>
        {saveState ? (
          <div className={`learning-save-banner ${saveState.status}`}>
            <p>{saveState.message}</p>
            {saveState.status === 'error' ? (
              <button type="button" className="question-secondary-button" onClick={onRetrySave}>
                Retry save
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="result-stat-grid">
          {hasAutomaticScore ? <><div><strong>{grade.correct}</strong><span>Correct</span></div><div><strong>{grade.incorrect}</strong><span>Incorrect</span></div></> : null}
          {grade.manualTotal ? <div><strong>{grade.manualTotal}</strong><span>FRQ self-review</span></div> : null}
          {session.config.mode === 'practice' ? (
            <div><strong>{grade.skipped}</strong><span>Skipped</span></div>
          ) : (
            <div><strong>{grade.unanswered}</strong><span>Unanswered</span></div>
          )}
          <div><strong>{formatDuration(elapsed)}</strong><span>Time</span></div>
        </div>
      </section>

      {customSummary ? (
        <section className="result-section diagnostic-recommendations">
          <h2>{customSummary.heading}</h2>
          <p>{customSummary.message}</p>
          {customSummary.recommendations.length ? <ol>{customSummary.recommendations.map((item) => <li key={item.skillId}><strong>{item.label}</strong> — {item.reason}{item.lessonUrl ? <> · <a href={item.lessonUrl}>Open lesson</a></> : null} · <a href={item.practiceUrl}>Practice topic</a></li>)}</ol> : null}
          {customSummary.errorPatterns?.length ? (
            <>
              <h3>Error patterns to revisit</h3>
              <ul className="diagnostic-error-patterns">
                {customSummary.errorPatterns.map((item) => (
                  <li key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.correction}</span>
                    <small>Self-check prompt: {item.diagnosticCue}</small>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}

      <section className="result-section">
        <h2>Performance by material</h2>
        <div className="material-results">
          {Object.keys(grade.byMaterial).length ? Object.entries(grade.byMaterial).map(([material, result]) => {
            const materialPercent = getMaterialPercent(result)
            return (
              <div className="material-result" key={material}>
                <div className="material-result-copy">
                  <strong>{getFilterOptionLabel(topic, reportingGroup?.id || 'material', material)}</strong>
                  <span>{result.total ? `${result.correct} of ${result.total} correct` : result.ungraded ? `${result.ungraded} free response${result.ungraded === 1 ? '' : 's'} to self-review` : 'No submitted response to self-review'}</span>
                </div>
                {result.total ? <div className="material-progress" role="progressbar" aria-label={`${material} score`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={materialPercent}><span className={`score-bg-${getScoreBand(materialPercent)}`} style={{ width: `${materialPercent}%` }} /></div> : null}
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
            const isUngraded = Boolean(detail?.isUngraded)
            const orderedOptions = getOrderedOptions(question, session)
            const timeSpent = getQuestionTimeSeconds(session, question.id)
            const categoryLabels = (question.classifications[reportingGroup?.id || 'material'] || [])
              .map((value) => getFilterOptionLabel(topic, reportingGroup?.id || 'material', value))
              .join(', ') || 'Uncategorized'
            return (
              <article className={`review-card ${wasSkipped ? 'skipped' : isCorrect ? 'correct' : isUngraded ? 'self-review' : selectedId && wasSubmitted ? 'incorrect' : 'unanswered'}`} key={question.id}>
                <div className="review-heading">
                  <span>Question {index + 1} · {categoryLabels}{session.flagged[question.id] ? ' · Flagged' : ''}</span>
                  <strong>{wasSkipped ? 'Skipped' : isCorrect ? 'Correct' : isUngraded ? 'Self-review' : selectedId && wasSubmitted ? 'Incorrect' : 'Unanswered'}</strong>
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
                <QuestionReferenceSupport question={question} />
                {question.renderer === 'free-response' ? <DraftRubric question={question} /> : null}
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

export function QuestionPage({ topic, initialFilters = {}, allowedQuestionIds = null, sessionLabel = null, sessionPreset = null, resultSummaryKind = null, onNavigate }) {
  const { authStatus, user } = useAuth()
  const [createResultSummary, setCreateResultSummary] = useState(null)
  useEffect(() => {
    let active = true
    if (!sessionPreset || !resultSummaryKind) {
      return () => { active = false }
    }
    import('../content/apChemistryLearningLoop.js').then((module) => {
      if (!active) return
      setCreateResultSummary(() => (payload) => module.createApChemistryAssessmentSummary({
        ...payload,
        blueprint: sessionPreset,
      }))
    }).catch(() => {
      if (active) setCreateResultSummary(null)
    })
    return () => { active = false }
  }, [resultSummaryKind, sessionPreset])
  const [savedSession, setSavedSession] = useState(() => {
    const saved = topic ? readSavedSession(topic.slug) : null
    if (saved && sessionPreset && saved.config?.assessmentId !== sessionPreset.id) return null
    if (!saved || !allowedQuestionIds?.length) return saved
    const allowed = new Set(allowedQuestionIds)
    return saved.questionIds.every((id) => allowed.has(id)) ? saved : null
  })
  const [session, setSession] = useState(null)
  const [setupOpen, setSetupOpen] = useState(true)
  const [now, setNow] = useState(0)
  const [navigatorExpanded, setNavigatorExpanded] = useState(true)
  const [flagReviewOpen, setFlagReviewOpen] = useState(false)
  const [saveState, setSaveState] = useState({
    status: 'idle',
    message: '',
  })
  const [saveAttemptNonce, setSaveAttemptNonce] = useState(0)
  const persistedFingerprintsRef = useRef(new Set())
  const typedResponseRef = useRef(null)
  const questionPromptRef = useRef(null)

  const questions = useMemo(
    () => session ? getQuestionsByIds(session.questionIds) : [],
    [session],
  )
  const persistencePolicy = useMemo(
    () => getQuestionPersistencePolicy(questions, { useFirestoreEmulator: clientEnvironment.useFirestoreEmulator }),
    [questions],
  )
  const currentQuestion = session ? questions[session.currentIndex] : null
  const currentQuestionId = currentQuestion?.id || null
  const selectedOptionId = currentQuestion ? session.answers[currentQuestion.id] : null
  const isCurrentSubmitted = currentQuestion ? Boolean(session.submitted[currentQuestion.id]) : false
  const isPractice = session?.config.mode === 'practice'
  const displaySaveState = useMemo(() => {
    if (!session || session.status !== 'complete' || authStatus !== 'signed-in' || !user) return null

    if (!persistencePolicy.allowed) {
      return { status: 'preview', message: persistencePolicy.message }
    }

    if (saveState.status === 'saving' || saveState.status === 'saved' || saveState.status === 'error') {
      return saveState
    }

    return null
  }, [authStatus, persistencePolicy, saveState, session, user])

  useEffect(() => {
    if (!currentQuestionId || session?.status !== 'active') return
    questionPromptRef.current?.focus({ preventScroll: true })
  }, [currentQuestionId, session?.status])

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

  useEffect(() => {
    if (!session || session.status !== 'complete' || !canPersistLearningRecords(user, session) || !persistencePolicy.allowed) return

    const fingerprint = createPersistenceFingerprint(user.uid, session.id)
    let cancelled = false

    void (async () => {
      if (persistedFingerprintsRef.current.has(fingerprint)) {
        if (cancelled) return
        setSaveState({
          status: 'saved',
          message: 'Saved to your account. Future visits on other devices can use this history.',
        })
        return
      }

      setSaveState({
        status: 'saving',
        message: 'Saving this completed session to your account…',
      })

      try {
        const result = await persistLearningRecords({ user, session, questions })
        if (cancelled) return

        persistedFingerprintsRef.current.add(fingerprint)
        setSaveState({
          status: 'saved',
          message: result.status === 'duplicate'
            ? 'This session was already saved to your account.'
            : 'Saved to your account. Future visits on other devices can use this history.',
        })
      } catch {
        if (cancelled) return

        setSaveState({
          status: 'error',
          message: 'We could not save this session right now. Your results still remain available here.',
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [authStatus, persistencePolicy, questions, saveAttemptNonce, session, user])

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
    setSaveState({ status: 'idle', message: '' })
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
    setSaveState({ status: 'idle', message: '' })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function retrySession() {
    const matchingQuestions = restrictQuestionPool(getQuestions({
      topic: session.config.topic,
      filters: session.config.filters,
    }), allowedQuestionIds)
    const nextSession = createSession(session.config, matchingQuestions)
    setNow(nextSession.startedAt)
    setSession(nextSession)
    setSetupOpen(false)
    setNavigatorExpanded(nextSession.questionIds.length <= 20)
    setSaveState({ status: 'idle', message: '' })
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
    setSaveState({ status: 'idle', message: '' })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function retrySave() {
    if (!session?.id || !user?.uid) return
    persistedFingerprintsRef.current.delete(createPersistenceFingerprint(user.uid, session.id))
    setSaveAttemptNonce((current) => current + 1)
  }

  if (setupOpen) {
    return (
      <div className="question-setup-page">
        <SetupModal
          topic={topic}
          initialFilters={initialFilters}
          allowedQuestionIds={allowedQuestionIds}
          sessionLabel={sessionLabel}
          sessionPreset={sessionPreset}
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
        saveState={displaySaveState}
        onNewSession={resetToSetup}
        onRetry={retrySession}
        onExit={() => navigateToTopic(true)}
        onRetrySave={retrySave}
        createResultSummary={createResultSummary}
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
          <div
            className={`session-timer${remainingSeconds !== null && remainingSeconds < 60 ? ' urgent' : ''}`}
            role="timer"
            aria-live="off"
            aria-atomic="true"
            aria-label={remainingSeconds !== null && remainingSeconds < 60
              ? `Less than one minute remaining. ${formatDuration(remainingSeconds)}`
              : undefined}
          >
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
          <QuestionStimulus stimulus={currentQuestion.stimulus} />
          <h1 id="question-prompt" ref={questionPromptRef} tabIndex="-1">{currentQuestion.prompt}</h1>
          {currentQuestion.parts?.length ? <ol className="frq-parts">{currentQuestion.parts.map((part) => <li key={part.id} value={part.label.charCodeAt(0) - 96}>{part.prompt}</li>)}</ol> : null}
          <p className="answer-instruction">
            {currentQuestion.renderer === 'multiple-choice'
              ? 'Select an answer. Use the eye-slash button to eliminate choices.'
              : currentQuestion.renderer === 'grid-in'
                ? 'Enter your answer in the box below.'
                : 'Write your response in the box below. After submission, use the point-by-point draft rubric for self-review.'}
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
            <div
              className={`typed-answer ${currentQuestion.renderer}`}
              onClick={() => typedResponseRef.current?.focus()}
            >
              <label htmlFor="typed-response">{currentQuestion.renderer === 'grid-in' ? 'Your answer' : 'Your response'}</label>
              {currentQuestion.renderer === 'grid-in' ? (
                <input
                  id="typed-response"
                  ref={typedResponseRef}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  aria-describedby="typed-response-help"
                  value={selectedOptionId || ''}
                  disabled={isPractice && isCurrentSubmitted}
                  onChange={(event) => updateTypedAnswer(event.target.value)}
                />
              ) : (
                <textarea
                  id="typed-response"
                  ref={typedResponseRef}
                  rows="8"
                  aria-describedby="typed-response-help"
                  value={selectedOptionId || ''}
                  disabled={isPractice && isCurrentSubmitted}
                  onChange={(event) => updateTypedAnswer(event.target.value)}
                />
              )}
              <p id="typed-response-help">{currentQuestion.renderer === 'grid-in' ? 'Exact-match grading ignores spaces at the beginning and end.' : 'Your response is not automatically scored and is excluded from the selected-response percentage.'}</p>
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
              <QuestionReferenceSupport question={currentQuestion} />
              {currentQuestion.renderer === 'free-response' ? <DraftRubric question={currentQuestion} /> : null}
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
