import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { apChemistrySources } from '../taxonomy/apChemistrySources.js'
import { createSkillPracticeUrl, getSkill } from '../taxonomy/contentTaxonomy.js'
import { clientEnvironment } from '../environment.js'
import { getApChemistryFormulaConceptGroup } from './apChemistryFormulaConcepts.js'
import {
  createResourceBrowserUrl,
  createResourceUrl,
  getResourceUnitLabel,
  resolveResourceRoute,
} from './resourceRoutes.js'
import { getEditorialResource, getEditorialResourcesForDomain } from './resourceCatalog.js'

function Markdown({ children }) {
  return <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{children}</ReactMarkdown>
}

function Provenance({ resource }) {
  const sources = resource.provenance.sourceIds.map((id) => apChemistrySources.find((source) => source.id === id)).filter(Boolean)
  return (
    <aside className="resource-provenance" aria-label="Source and review information">
      <strong>{resource.review.status === 'draft' ? 'Editorial draft — not educator reviewed' : resource.review.status}</strong>
      <p>{resource.provenance.originalityNote}</p>
      <p>Framework references:</p>
      <ul>{sources.map((source) => <li key={source.id}><a href={source.canonicalUrl} target="_blank" rel="noreferrer">{source.title}</a> ({source.usageStatus})</li>)}</ul>
    </aside>
  )
}

function WorkedExample({ example }) {
  return (
    <section className="resource-worked-example">
      <h2>Worked example</h2>
      <Markdown>{example.prompt}</Markdown>
      <ol>{example.steps.map((step) => <li key={step}><Markdown>{step}</Markdown></li>)}</ol>
      <p><strong>Answer:</strong> {example.answer}</p>
    </section>
  )
}

const examReferenceLabels = Object.freeze({
  provided: 'Relationship provided on the 2026 exam reference information',
  'partly-provided': 'Partly provided; an additional reasoning step is required',
  'not-provided': 'Not separately provided on the 2026 exam reference information',
})

function conceptGroupLabel(value) {
  return getApChemistryFormulaConceptGroup(value)?.label || value
    .split('-')
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() || ''}${word.slice(1)}`)
    .join(' ')
}

function Lesson({ resource, onNavigate }) {
  return (
    <>
      <section><h2>Prerequisites</h2><ul>{resource.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul></section>
      {resource.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><Markdown>{section.body}</Markdown></section>)}
      {resource.workedExamples.map((example) => <WorkedExample key={example.prompt} example={example} />)}
      <section><h2>Common misconceptions</h2>{resource.misconceptions.map((item) => <article key={item.id} className="misconception-card"><h3>{item.claim}</h3><p>{item.correction}</p></article>)}</section>
      <section><h2>Retrieval check</h2>{resource.retrievalChecks.map((item) => <details key={item.prompt}><summary>{item.prompt}</summary><p>{item.answer}</p></details>)}</section>
      <section><h2>Formula references</h2><ul>{resource.formulaIds.map((id) => {
        const formula = getEditorialResource(id, { includeDrafts: clientEnvironment.editorialPreview })
        const url = formula ? createResourceUrl(formula) : null
        return <li key={id}>{url ? <a href={url} onClick={onNavigate(url)}>{formula.title}</a> : id}</li>
      })}</ul></section>
    </>
  )
}

function Formula({ resource, onNavigate }) {
  const examSource = apChemistrySources.find(({ id }) => id === resource.examReference.sourceId)
  return (
    <>
      <section className="formula-expression" aria-label="Formula"><code>{resource.expression}</code></section>
      <aside className={`formula-availability formula-availability-${resource.examReference.status}`}>
        <strong>{examReferenceLabels[resource.examReference.status]}</strong>
        <p>{resource.examReference.note}</p>
        {examSource ? <a href={examSource.canonicalUrl} target="_blank" rel="noreferrer">Open the official reference information</a> : null}
      </aside>
      <section><h2>Variables</h2><div className="resource-table-scroll"><table><caption className="sr-only">Variable definitions for {resource.title}</caption><thead><tr><th scope="col">Symbol</th><th scope="col">Meaning</th><th scope="col">Units</th></tr></thead><tbody>{resource.variables.map((variable) => <tr key={variable.symbol}><th scope="row">{variable.symbol}</th><td>{variable.meaning}</td><td>{variable.units}</td></tr>)}</tbody></table></div></section>
      <section><h2>Assumptions</h2><ul>{resource.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section><h2>Use it when</h2><ul>{resource.appliesWhen.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section><h2>Do not use it when</h2><ul>{resource.doesNotApplyWhen.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section><h2>Useful forms and decisions</h2><ul>{resource.rearrangements.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <WorkedExample example={resource.workedExample} />
      <aside className="resource-warning"><strong>Common mistake:</strong> {resource.commonMistake}</aside>
      <section><h2>Linked practice topics</h2><ul>{resource.alignment.skillIds.map((skillId) => {
        const skill = getSkill('ap-chemistry', skillId)
        const url = createSkillPracticeUrl('ap-chemistry', skillId)
        return <li key={skillId}><a href={url} onClick={onNavigate(url)}>{skill?.title || skillId}</a></li>
      })}</ul></section>
    </>
  )
}

function FormulaCenter({ result, onNavigate }) {
  const [query, setQuery] = useState('')
  const [conceptGroup, setConceptGroup] = useState('all')
  const [referenceStatus, setReferenceStatus] = useState('all')
  const formulas = getEditorialResourcesForDomain(result.subject.id, result.domain.id, {
    includeDrafts: clientEnvironment.editorialPreview,
    kinds: ['formula'],
  })
  const normalized = query.trim().toLowerCase()
  const conceptGroups = [...new Set(formulas.map(({ conceptGroup: group }) => group))].sort()
  const visible = formulas.filter((formula) => (
    (!normalized || [formula.title, formula.summary, formula.expression]
      .some((value) => value.toLowerCase().includes(normalized)))
    && (conceptGroup === 'all' || formula.conceptGroup === conceptGroup)
    && (referenceStatus === 'all' || formula.examReference.status === referenceStatus)
  ))
  const officialReference = apChemistrySources.find(({ id }) => id === 'ap-chemistry-reference-2026')
  return (
    <main className="page study-resource-page formula-center-page">
      <header>
        <p className="topic-browser-eyebrow">AP {result.subject.label} · {getResourceUnitLabel(result.domain)}</p>
        <h1>Formula and reference center</h1>
        <p>Original explanations for choosing and applying relationships in {result.domain.label}. This is a study companion, not the official exam reference sheet.</p>
        <ul className="official-reference-links">
          <li><a href={officialReference.canonicalUrl} target="_blank" rel="noreferrer">Open the complete official AP Chemistry exam reference information</a></li>
          <li><a href={`${officialReference.canonicalUrl}#page=2`} target="_blank" rel="noreferrer">Open the official periodic table (page 2)</a></li>
          <li><a href={`${officialReference.canonicalUrl}#page=3`} target="_blank" rel="noreferrer">Open official equations and constants (pages 3-4)</a></li>
        </ul>
        <button type="button" className="resource-print-button" onClick={() => window.print()}>Print this reference list</button>
      </header>
      <section className="formula-search-panel">
        <label htmlFor="formula-search">Search {getResourceUnitLabel(result.domain)} formulas</label>
        <input id="formula-search" type="search" value={query} onChange={(event) => setQuery(event.target.value.slice(0, 100))} placeholder={`Search ${result.domain.label.toLowerCase()} relationships`} />
        <label htmlFor="formula-concept-filter">Concept</label>
        <select id="formula-concept-filter" value={conceptGroup} onChange={(event) => setConceptGroup(event.target.value)}>
          <option value="all">All concepts</option>
          {conceptGroups.map((value) => <option key={value} value={value}>{conceptGroupLabel(value)}</option>)}
        </select>
        <label htmlFor="formula-reference-filter">Exam reference availability</label>
        <select id="formula-reference-filter" value={referenceStatus} onChange={(event) => setReferenceStatus(event.target.value)}>
          <option value="all">All availability types</option>
          {Object.entries(examReferenceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <p role="status" aria-live="polite">{visible.length} {visible.length === 1 ? 'entry' : 'entries'} shown</p>
      </section>
      <section className="formula-card-grid" aria-label="Formula entries">
        {visible.map((formula) => {
          const url = createResourceUrl(formula)
          return <article className="formula-index-card" key={formula.id}><p className="topic-browser-eyebrow">{formula.review.status} · {conceptGroupLabel(formula.conceptGroup)}</p><h2><a href={url} onClick={onNavigate(url)}>{formula.title}</a></h2><p>{formula.summary}</p><p className={`formula-reference-label formula-reference-${formula.examReference.status}`}>{examReferenceLabels[formula.examReference.status]}</p><code>{formula.expression}</code></article>
        })}
        {!visible.length ? <p>{formulas.length ? 'No formula entries match that search.' : `No reviewed ${getResourceUnitLabel(result.domain)} formula entries are published yet. Use the official reference link while editorial review continues.`}</p> : null}
      </section>
    </main>
  )
}

export function StudyResourcePage({ route, onNavigate }) {
  const result = resolveResourceRoute(route, { includeDrafts: clientEnvironment.editorialPreview })
  if (result.status === 'index') return <FormulaCenter result={result} onNavigate={onNavigate} />
  const subjectId = result.subject?.id || 'ap-chemistry'
  const domainId = result.domain?.id || null
  const browserUrl = createResourceBrowserUrl(subjectId, domainId) || '/topics.html?topic=ap-chemistry'
  if (result.status !== 'valid') {
    const hidden = result.status === 'draft-hidden'
    const returnLabel = result.domain ? getResourceUnitLabel(result.domain) : 'AP Chemistry'
    return <main className="page resource-empty"><h1>{hidden ? 'Resource awaiting review' : 'Resource not found'}</h1><p>{hidden ? 'This draft is available only in an explicitly enabled local editorial preview.' : 'That lesson or formula does not match this AP Chemistry unit.'}</p><a href={browserUrl} onClick={onNavigate(browserUrl)}>Return to {returnLabel}</a></main>
  }
  const { resource } = result
  const label = getResourceUnitLabel(result.domain)
  return (
    <main className="page study-resource-page">
      <nav aria-label="Breadcrumb"><a href={browserUrl} onClick={onNavigate(browserUrl)}>AP {result.subject.label} / {label}</a></nav>
      <header><p className="topic-browser-eyebrow">{resource.kind === 'lesson' ? 'Lesson' : 'Formula reference'} · Editorial preview</p><h1>{resource.title}</h1><p>{resource.summary}</p></header>
      <Provenance resource={resource} />
      <article className="study-resource-content">{resource.kind === 'lesson' ? <Lesson resource={resource} onNavigate={onNavigate} /> : <Formula resource={resource} onNavigate={onNavigate} />}</article>
    </main>
  )
}
