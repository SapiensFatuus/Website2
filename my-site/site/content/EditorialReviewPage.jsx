import { useMemo, useState } from 'react'
import { createEditorialReviewQueue } from './editorialReviewQueue.js'
import { apChemistryFrqExemplars } from './apChemistryFrqExemplars.js'
import { editorialResources } from './resourceCatalog.js'
import { canonicalQuestions } from '../questions/catalog/index.js'
import { clientEnvironment } from '../environment.js'
import { getDomain, getSkill, getSubject } from '../taxonomy/contentTaxonomy.js'

function searchable(item) {
  return [item.id, item.title, item.itemType, item.format, item.responseFormat, ...item.topicIds, ...item.sciencePracticeIds]
    .join(' ')
    .toLowerCase()
}

export function EditorialReviewPage({ subjectId, domainId, onNavigate }) {
  const [query, setQuery] = useState('')
  const [itemType, setItemType] = useState('all')
  const [format, setFormat] = useState('all')
  const subject = getSubject(subjectId)
  const domain = getDomain(subjectId, domainId)
  const queue = useMemo(() => createEditorialReviewQueue({
    questions: canonicalQuestions.filter((question) => (
      question.taxonomy.subjectId === subjectId
      && question.taxonomy.domainId === domainId
      && question.content.status !== 'published'
      && question.content.status !== 'retired'
    )),
    resources: editorialResources.filter((resource) => (
      resource.alignment.subjectId === subjectId
      && resource.alignment.domainId === domainId
      && resource.review.status !== 'published'
      && resource.review.status !== 'retired'
    )),
    exemplars: apChemistryFrqExemplars.filter((record) => (
      record.alignment.subjectId === subjectId
      && record.alignment.domainId === domainId
      && record.review.status !== 'published'
      && record.review.status !== 'retired'
    )),
  }), [domainId, subjectId])
  const normalizedQuery = query.trim().toLowerCase()
  const visibleItems = queue.items.filter((item) => (
    (itemType === 'all' || item.itemType === itemType)
    && (format === 'all' || item.responseFormat === format || item.format === format)
    && (!normalizedQuery || searchable(item).includes(normalizedQuery))
  ))

  if (!clientEnvironment.editorialPreview) {
    return (
      <main className="editorial-review-page">
        <h1>Editorial review unavailable</h1>
        <p>This draft queue is exposed only in explicit development editorial preview.</p>
      </main>
    )
  }

  if (!subject || !domain || subject.id !== 'ap-chemistry') {
    return (
      <main className="editorial-review-page">
        <h1>Editorial queue not found</h1>
        <p>Select a canonical AP Chemistry unit before opening its draft review queue.</p>
        <a href="/topics.html?topic=ap-chemistry" onClick={onNavigate('/topics.html?topic=ap-chemistry')}>Browse AP Chemistry units</a>
      </main>
    )
  }

  const browserUrl = `/topics.html?topic=${encodeURIComponent(subject.id)}&domain=${encodeURIComponent(domain.id)}`
  const unitLabel = `Unit ${domain.officialNumber}: ${domain.label}`

  return (
    <main className="editorial-review-page">
      <header className="editorial-review-header">
        <p className="topic-browser-eyebrow">AP Chemistry · {unitLabel} · development only</p>
        <h1>Editorial review queue</h1>
        <p>This read-only queue organizes AI-assisted drafts for human review. Every checklist gate below is pending; appearing here is not approval, publication, or chemistry-expert verification.</p>
        <a href={browserUrl} onClick={onNavigate(browserUrl)}>Return to {unitLabel}</a>
      </header>

      <section className="editorial-review-summary" aria-label="Review queue summary">
        <div><strong>{queue.itemCount}</strong><span>Total drafts</span></div>
        <div><strong>{queue.questionCount}</strong><span>Questions</span></div>
        <div><strong>{queue.resourceCount}</strong><span>Resources</span></div>
        <div><strong>{queue.exemplarCount}</strong><span>Exemplar sets</span></div>
        <div><strong>{queue.pendingChecklistCount}</strong><span>Pending gate checks</span></div>
        <div><strong>{queue.similarityFlags.length}</strong><span>Internal similarity flags</span></div>
      </section>

      <section className="editorial-review-controls" aria-labelledby="review-filter-heading">
        <h2 id="review-filter-heading">Filter the queue</h2>
        <label><span>Search IDs, text, topics, or practices</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label><span>Item type</span><select value={itemType} onChange={(event) => setItemType(event.target.value)}><option value="all">All items</option><option value="question">Questions</option><option value="resource">Resources</option><option value="exemplar">Exemplar sets</option></select></label>
        <label><span>Format</span><select value={format} onChange={(event) => setFormat(event.target.value)}><option value="all">All formats</option>{queue.formatCounts.map(({ id, count }) => <option value={id} key={id}>{id} ({count})</option>)}</select></label>
      </section>

      <section aria-labelledby="review-items-heading">
        <div className="editorial-review-list-heading"><h2 id="review-items-heading">Pending items</h2><span>{visibleItems.length} shown</span></div>
        <div className="editorial-review-list">
          {visibleItems.map((item) => {
            const topics = item.topicIds.map((id) => getSkill('ap-chemistry', id)).filter(Boolean)
            return (
              <article className="editorial-review-card" key={item.id}>
                <div className="editorial-review-card-heading"><span>{item.itemType} · {item.responseFormat || item.format}</span><strong>{item.status}</strong></div>
                <h3>{item.title}</h3>
                <code>{item.id}</code>
                <p><b>Topics:</b> {topics.map((topic) => `${topic.officialNumber} ${topic.label}`).join(', ')}</p>
                <p><b>Science practices:</b> {item.sciencePracticeIds.join(', ')}</p>
                <p><b>Author record:</b> {item.authoredBy} · updated {item.updatedAt || 'date missing'} · {item.reviewerIds.length} reviewers</p>
                {item.similarityFlags.length ? <p className="editorial-similarity-warning"><b>Internal similarity review required:</b> {item.similarityFlags.length} flag{item.similarityFlags.length === 1 ? '' : 's'}. This compares first-party drafts only.</p> : null}
                <details><summary>{item.checklist.length} mandatory review gates · all pending</summary><ul>{item.checklist.map((gate) => <li key={gate.id}><strong>{gate.id}</strong> ({gate.owner}) — {gate.prompt}</li>)}</ul></details>
              </article>
            )
          })}
          {!visibleItems.length ? <p>{queue.itemCount ? 'No review items match those filters.' : `No draft review items are registered for ${unitLabel}.`}</p> : null}
        </div>
      </section>
    </main>
  )
}
