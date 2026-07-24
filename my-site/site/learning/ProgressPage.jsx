import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { getEditorialResourcesForSkill } from '../content/resourceCatalog.js'
import { createResourceUrl } from '../content/resourceRoutes.js'
import { createDomainProgressSummary } from '../content/domainProgress.js'
import { createReassessmentReadiness } from '../content/reassessmentReadiness.js'
import {
  createApChemistryAssessmentUrl,
  getAssessmentBlueprintsForDomain,
} from '../content/apChemistryAssessments.js'
import { clientEnvironment } from '../environment.js'
import { createSkillPracticeUrl, getDomain, getSubject } from '../taxonomy/contentTaxonomy.js'
import { loadUserMasterySnapshot } from './learningFirestore.js'

export function ProgressPage({ subjectId, domainId, onNavigate }) {
  const { authStatus, user, signIn, isAuthenticating, authError } = useAuth()
  const [snapshotsBySkillId, setSnapshotsBySkillId] = useState({})
  const [loadState, setLoadState] = useState('idle')
  const [loadedKey, setLoadedKey] = useState('')
  const subject = getSubject(subjectId)
  const domain = getDomain(subjectId, domainId)
  const progressKey = user?.uid && domain ? `${user.uid}:${subjectId}:${domain.id}` : ''

  useEffect(() => {
    if (authStatus !== 'signed-in' || !user?.uid || !domain) return undefined
    let cancelled = false
    void Promise.all(domain.skills.map(async (skill) => [
      skill.id,
      await loadUserMasterySnapshot(user.uid, skill.id),
    ])).then((entries) => {
      if (cancelled) return
      setSnapshotsBySkillId(Object.fromEntries(entries))
      setLoadedKey(progressKey)
      setLoadState('loaded')
    }).catch(() => {
      if (!cancelled) {
        setLoadedKey(progressKey)
        setLoadState('error')
      }
    })
    return () => { cancelled = true }
  }, [authStatus, domain, progressKey, user?.uid])

  const summary = useMemo(
    () => createDomainProgressSummary({ domain, snapshotsBySkillId }),
    [domain, snapshotsBySkillId],
  )

  if (!subject || !domain) {
    return <main className="progress-page"><h1>Progress unavailable</h1><p>That course unit does not match the canonical catalog.</p></main>
  }

  if (authStatus !== 'signed-in') {
    return (
      <main className="progress-page">
        <p className="topic-browser-eyebrow">{subject.label} · Unit {domain.officialNumber}</p>
        <h1>{domain.label} progress</h1>
        <p>Sign in to read private mastery snapshots saved from completed practice. Guest practice remains available without an account.</p>
        <button type="button" className="primary-button" onClick={signIn} disabled={authStatus === 'loading' || isAuthenticating}>{isAuthenticating ? 'Opening Google…' : 'Sign in with Google'}</button>
        {authError ? <p role="alert">{authError}</p> : null}
      </main>
    )
  }

  if (loadedKey !== progressKey || loadState === 'idle') return <main className="progress-page"><h1>{domain.label} progress</h1><p>Loading your private progress…</p></main>
  if (loadState === 'error') return <main className="progress-page"><h1>{domain.label} progress</h1><p role="alert">Progress could not be loaded. Your practice records were not changed.</p></main>

  const recommended = domain.skills.find(({ id }) => id === summary.recommendedSkillId) || null
  const recommendedLesson = recommended
    ? getEditorialResourcesForSkill(subjectId, recommended.id, { includeDrafts: clientEnvironment.editorialPreview, kinds: ['lesson'] })[0] || null
    : null
  const domainAssessments = subjectId === 'ap-chemistry'
    ? getAssessmentBlueprintsForDomain(domain.id)
    : []
  const diagnosticBlueprint = domainAssessments.find(({ kind }) => kind === 'diagnostic') || null
  const reassessmentBlueprint = domainAssessments.find(({ kind }) => kind === 'reassessment') || null
  const showReassessmentPreview = Boolean(diagnosticBlueprint && reassessmentBlueprint)
    && clientEnvironment.editorialPreview
    && clientEnvironment.useFirestoreEmulator
  const reassessmentReadiness = showReassessmentPreview
    ? createReassessmentReadiness({ snapshotsBySkillId })
    : null
  const diagnosticUrl = diagnosticBlueprint ? createApChemistryAssessmentUrl(diagnosticBlueprint.id) : null
  const reassessmentUrl = reassessmentBlueprint ? createApChemistryAssessmentUrl(reassessmentBlueprint.id) : null

  return (
    <main className="progress-page">
      <header>
        <p className="topic-browser-eyebrow">{subject.label} · Unit {domain.officialNumber}</p>
        <h1>{domain.label} progress</h1>
        <p>This is a study signal from recorded practice, not a predicted AP score or a validated mastery estimate.</p>
      </header>
      <section className="progress-overview" aria-labelledby="progress-overview-heading">
        <h2 id="progress-overview-heading">Topic coverage</h2>
        <strong>{summary.practicedSkillCount} of {summary.skillCount} topics practiced</strong>
        <div className="question-progress" role="progressbar" aria-label="Unit topic coverage" aria-valuemin="0" aria-valuemax="100" aria-valuenow={summary.coveragePercent}><span style={{ width: `${summary.coveragePercent}%` }} /></div>
      </section>
      {recommended ? (
        <section className="progress-recommendation">
          <h2>Recommended next activity</h2>
          <p><strong>{recommended.officialNumber} {recommended.label}</strong> — {summary.recommendationReason}</p>
          <div className="topic-browser-resource-actions">
            {recommendedLesson ? <a href={createResourceUrl(recommendedLesson)} onClick={onNavigate(createResourceUrl(recommendedLesson))}>Open lesson</a> : null}
            <a href={createSkillPracticeUrl(subjectId, recommended.id)} onClick={onNavigate(createSkillPracticeUrl(subjectId, recommended.id))}>Practice topic</a>
          </div>
        </section>
      ) : null}
      {reassessmentReadiness ? (
        <section className="progress-recommendation reassessment-readiness" aria-labelledby="reassessment-readiness-heading">
          <h2 id="reassessment-readiness-heading">Separate-form reassessment</h2>
          {reassessmentReadiness.status === 'no-evidence' ? (
            <>
              <p>Complete the draft diagnostic and focused practice first. The separate form is intentionally not presented as evidence of retention without a recorded interval.</p>
              <a href={diagnosticUrl} onClick={onNavigate(diagnosticUrl)}>Start the diagnostic</a>
            </>
          ) : reassessmentReadiness.status === 'waiting' ? (
            <>
              <p>Wait about {reassessmentReadiness.remainingHours} more hour{reassessmentReadiness.remainingHours === 1 ? '' : 's'} after the latest recorded practice. This 48-hour spacing reduces immediate-recall overlap; it does not prove long-term retention.</p>
              <span className="reassessment-disabled" aria-disabled="true">Reassessment available {new Date(reassessmentReadiness.eligibleAt).toLocaleString()}</span>
            </>
          ) : (
            <>
              <p>At least 48 hours have passed since the latest recorded Unit {domain.officialNumber} practice. Use the separate form as one retention check, not as an AP-score prediction or proof of mastery.</p>
              <a href={reassessmentUrl} onClick={onNavigate(reassessmentUrl)}>Open the separate reassessment</a>
            </>
          )}
          <small>This preview reads only Firestore-emulator mastery timestamps. It never schedules against or writes draft results to live progress.</small>
        </section>
      ) : null}
      <section aria-labelledby="topic-progress-heading">
        <h2 id="topic-progress-heading">Topic details</h2>
        <div className="progress-topic-grid">
          {summary.skills.map(({ skill, progress }) => (
            <article className={`progress-topic-card ${progress.status}`} key={skill.id}>
              <p>{skill.officialNumber}</p>
              <h3>{skill.label}</h3>
              <strong>{progress.label}</strong>
              {progress.attemptCount ? <span>{progress.attemptCount} recorded attempt{progress.attemptCount === 1 ? '' : 's'} · {progress.recentAccuracyPercent}% recent accuracy</span> : <span>No recorded attempts</span>}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
