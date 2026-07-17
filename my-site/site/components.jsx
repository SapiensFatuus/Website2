import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './auth/AuthContext'
import { GOOGLE_SIGN_IN_UI_ENABLED } from './auth/authFeatures'
import { createDomainTutorUrl } from './chat/tutorScopes'
import {
  getSkillCatalogEntry,
  normalizeSearchText,
  sanitizeSkillSearchQuery,
  searchSkills,
  withSkillSearchQuery,
} from './catalog/skillSearch'
import {
  resolveSubjectLocation,
} from './taxonomy/contentTaxonomy'

const TOOLTIP_GAP = 6
const TOOLTIP_MARGIN = 12

function getPlacementOrder(side) {
  const fallbackMap = {
    top: ['top', 'bottom', 'right', 'left'],
    right: ['right', 'left', 'top', 'bottom'],
    bottom: ['bottom', 'top', 'right', 'left'],
    left: ['left', 'right', 'top', 'bottom'],
  }

  return fallbackMap[side] || fallbackMap.top
}

function getTooltipPosition(targetRect, tooltipRect, placement) {
  if (placement === 'top') {
    return {
      top: targetRect.top - tooltipRect.height - TOOLTIP_GAP,
      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
    }
  }

  if (placement === 'right') {
    return {
      top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
      left: targetRect.right + TOOLTIP_GAP,
    }
  }

  if (placement === 'bottom') {
    return {
      top: targetRect.bottom + TOOLTIP_GAP,
      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
    }
  }

  return {
    top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
    left: targetRect.left - tooltipRect.width - TOOLTIP_GAP,
  }
}

function fitsInViewport(position, tooltipRect) {
  return (
    position.top >= TOOLTIP_MARGIN &&
    position.left >= TOOLTIP_MARGIN &&
    position.top + tooltipRect.height <= window.innerHeight - TOOLTIP_MARGIN &&
    position.left + tooltipRect.width <= window.innerWidth - TOOLTIP_MARGIN
  )
}

function clampPosition(position, tooltipRect) {
  return {
    top: Math.min(
      Math.max(position.top, TOOLTIP_MARGIN),
      window.innerHeight - tooltipRect.height - TOOLTIP_MARGIN,
    ),
    left: Math.min(
      Math.max(position.left, TOOLTIP_MARGIN),
      window.innerWidth - tooltipRect.width - TOOLTIP_MARGIN,
    ),
  }
}

export function HelpTooltip({ text, side = 'top', className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, placement: side })
  const buttonRef = useRef(null)
  const tooltipRef = useRef(null)
  const tooltipId = useId()

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current || !tooltipRef.current) {
      return undefined
    }

    function updatePosition() {
      const targetRect = buttonRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const placements = getPlacementOrder(side)
      let nextPlacement = placements[0]
      let nextPosition = getTooltipPosition(targetRect, tooltipRect, nextPlacement)

      // Try the preferred side first, then flip through fallbacks until one fits.
      for (const placement of placements) {
        const candidatePosition = getTooltipPosition(targetRect, tooltipRect, placement)

        if (fitsInViewport(candidatePosition, tooltipRect)) {
          nextPlacement = placement
          nextPosition = candidatePosition
          break
        }
      }

      // If every side overflows a bit, keep the best placement and shift it on-screen.
      const clampedPosition = clampPosition(nextPosition, tooltipRect)
      setPosition({
        top: clampedPosition.top,
        left: clampedPosition.left,
        placement: nextPlacement,
      })
    }

    updatePosition()

    // Recalculate while the tooltip is open so it stays aligned during scrolling or resizing.
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, side, text])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      if (buttonRef.current?.contains(event.target) || tooltipRef.current?.contains(event.target)) {
        return
      }

      setIsOpen(false)
      setIsPinned(false)
    }

    function handleKeyDown(event) {
      if (event.key !== 'Escape') {
        return
      }

      setIsOpen(false)
      setIsPinned(false)
      buttonRef.current?.focus()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function openTooltip() {
    setIsOpen(true)
  }

  function closeTooltip() {
    if (isPinned) {
      return
    }

    setIsOpen(false)
  }

  function handleBlur(event) {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return
    }

    setIsPinned(false)
    setIsOpen(false)
  }

  function handleButtonClick() {
    if (isPinned) {
      setIsPinned(false)
      setIsOpen(false)
      return
    }

    // A click or tap turns the tooltip into a pinned state until the user dismisses it.
    setIsPinned(true)
    setIsOpen(true)
  }

  return (
    <span
      className={`help-tooltip ${className}`.trim()}
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
      onFocus={openTooltip}
      onBlur={handleBlur}
    >
      <button
        ref={buttonRef}
        type="button"
        className="help-tooltip-button"
        aria-label={`More information: ${text}`}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={handleButtonClick}
      >
        ?
      </button>
      {isOpen ? (
        <span
          ref={tooltipRef}
          id={tooltipId}
          className="help-tooltip-bubble"
          role="tooltip"
          data-side={position.placement}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {text}
        </span>
      ) : null}
    </span>
  )
}

export function Topbar({ pageClassName, showCounters, stats, onNavigate }) {
  const {
    authError,
    authStatus,
    clearAuthError,
    isAuthenticating,
    signIn,
    signOut,
    user,
  } = useAuth()
  const accountLabel = user?.displayName || user?.email || 'Signed in'

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-icon" aria-hidden="true">AI</div>
        <span>Study AI Helper</span>
      </div>
      {showCounters ? (
        <div className="topbar-counters" aria-label="Live user stats">
          <span className="counter-item counter-item-with-help">
            <span className="counter-label">Active:</span>
            <span className="counter-value" id="activeUsers">{stats.activeUsers}</span>
            <HelpTooltip
              text="These counters update from the site's tracker so you can see current activity at a glance."
              side="bottom"
            />
          </span>
          <span className="counter-item">
            <span className="counter-label">Total:</span>
            <span className="counter-value" id="totalUsers">{stats.totalUsers}</span>
          </span>
          <span className="counter-item">
            <span className="counter-label">Peak:</span>
            <span className="counter-value" id="peakUsers">{stats.peakActiveUsers}</span>
          </span>
          <span className="counter-item">
            <span className="counter-label">Visits:</span>
            <span className="counter-value" id="totalVisits">{stats.totalVisits}</span>
          </span>
        </div>
      ) : null}
      <nav className="nav-links" aria-label="Primary">
        <a
          href="/index.html"
          className={pageClassName === 'page-home' ? 'active' : ''}
          onClick={onNavigate('/index.html')}
        >
          Home
        </a>
        <a
          href="/about.html"
          className={pageClassName === 'page-about' ? 'active' : ''}
          onClick={onNavigate('/about.html')}
        >
          About
        </a>
        <a
          href="/contacts.html"
          className={pageClassName === 'page-contacts' ? 'active' : ''}
          onClick={onNavigate('/contacts.html')}
        >
          Contacts
        </a>
      </nav>
      <div className="account-controls" aria-live="polite">
        {authStatus === 'loading' ? <span className="account-status">Account loading…</span> : null}
        {authStatus === 'signed-in' ? (
          <>
            <div className="account-summary">
              <strong>{accountLabel}</strong>
              <span>Your progress can sync across devices.</span>
            </div>
            <button type="button" className="account-button secondary" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : null}
        {GOOGLE_SIGN_IN_UI_ENABLED && authStatus === 'signed-out' ? (
          <>
            <div className="account-summary">
              <strong>Guest mode</strong>
              <span>Practice works now. Sign in to keep your history.</span>
            </div>
            <button type="button" className="account-button" disabled={isAuthenticating} onClick={signIn}>
              {isAuthenticating ? 'Signing in…' : 'Sign in with Google'}
            </button>
          </>
        ) : null}
        {authError ? (
          <div className="account-error" role="alert">
            <span>{authError}</span>
            <button type="button" onClick={clearAuthError} aria-label="Dismiss account message">Dismiss</button>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export function HomePage({
  query,
  results,
  showDropdown,
  onQueryChange,
  onSearchKeyDown,
  onTopicSelect,
  searchDropdownRef,
}) {
  return (
    <main className="page page-home-main">
      <section className="search-hero">
        <h1>Which test do you want to study?</h1>
        <input
          type="text"
          id="searchInput"
          className="search-input"
          placeholder="Search tests (e.g., SAT Math, AP Chemistry)..."
          aria-label="Search tests"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={onSearchKeyDown}
        />
        <div
          id="searchDropdown"
          ref={searchDropdownRef}
          className="search-dropdown"
          role="listbox"
          aria-label="Search results"
          style={{ display: showDropdown ? 'block' : 'none' }}
        >
          {results.length === 0 ? (
            <div className="search-no-results">No tests found</div>
          ) : (
            results.map((topic) => (
              <div
                key={topic.slug}
                className="search-result-item"
                role="option"
                data-slug={topic.slug}
                onClick={() => onTopicSelect(topic)}
              >
                {topic.title}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

const fallbackOverviewCards = [
  { label: 'Sections', value: 'N/A' },
  { label: 'Pass Rate', value: 'N/A' },
  { label: '5 Rate', value: 'N/A' },
]

const fallbackSections = [
  { name: 'Section details coming soon', format: 'TBD', duration: 'TBD' },
]

const fallbackActions = [
  {
    label: 'Ask Questions',
    helpText: 'Ask the test tutor for explanations, step-by-step help, strategy, or a study plan.',
  },
  {
    label: 'Practice Questions',
    helpText: 'Try sample questions to check your understanding and spot weak areas.',
  },
  {
    label: 'View Topics',
    helpText: 'Browse the test’s units and skills when you want more focused help.',
  },
]

export function TopicPage({ topic, onActionClick, onNavigate }) {
  const overviewCards = topic?.overviewCards || fallbackOverviewCards
  const sections = topic?.sections || fallbackSections
  const actions = topic?.actions || fallbackActions
  const sectionLines = sections.flatMap((section) => {
    const lines = [
      {
        label: section.format || 'Details coming soon',
        minutes: section.duration || '',
      },
    ]

    if (section.breakDuration) {
      lines.push({
        label: 'Break',
        minutes: section.breakDuration,
      })
    }

    return lines
  })

  return (
    <main className="page">
      <section className="topic-hero">
        <div className="topic-hero-copy">
          <h1 id="topicTitle">{topic ? topic.title : 'Test not found'}</h1>
        </div>

        <div className="topic-overview-wrap">
          <aside className="topic-overview-card">
            <div className="topic-stat-row">
              {overviewCards.map((card) => (
                <div
                  className={`topic-stat-item${card.label === 'Sections' ? ' topic-stat-item-sections' : ''}`}
                  key={card.label}
                >
                  <div className="topic-stat-label topic-stat-label-with-help">
                    <span>{card.label}</span>
                    {card.helpText ? <HelpTooltip text={card.helpText} side="top" /> : null}
                  </div>
                  {card.label === 'Sections' ? (
                    <div className="topic-stat-detail-list">
                      {sectionLines.map((line, index) => (
                        <div className="topic-stat-detail-line" key={`${line.label}-${line.minutes}-${index}`}>
                          <span>{line.label}</span>{' '}
                          {line.minutes ? <span className="topic-stat-detail-minutes">{line.minutes}</span> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="topic-stat-value topic-stat-value-prominent">{card.value}</div>
                  )}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="topic-summary">
        <div className="summary-card">
          <p id="topicSummary">
            {topic ? topic.summary : 'The test you selected does not exist yet.'}
          </p>
        </div>
      </section>

      <section className="topic-actions" aria-label="Learning options">
        <div className="topic-actions-intro">
          Choose how you want to prepare for this test.
        </div>

        {actions.map((action) => (
          <div className="topic-action-card" key={action.label}>
            <div className="topic-action-help">
              {action.helpText ? <HelpTooltip text={action.helpText} side="top" /> : null}
            </div>
            <button
              className="topic-action-btn"
              data-method={action.label}
              type="button"
              onClick={onActionClick}
            >
              {action.label === 'Ask Questions' && ['sat-math', 'ap-chemistry'].includes(topic?.slug)
                ? `Ask the ${topic.slug === 'sat-math' ? 'SAT Math' : 'AP Chemistry'} Tutor`
                : action.label === 'View Topics' ? 'View units and skills' : action.label}
            </button>
          </div>
        ))}
      </section>

      <div className="topic-back-wrap">
        <a href="/index.html" className="topic-back-link" onClick={onNavigate('/index.html')}>
          Back to search
        </a>
      </div>
    </main>
  )
}

function SkillCatalogCard({ entry, isSelected, selectedSkillRef, searchQuery, onNavigate }) {
  const browserUrl = withSkillSearchQuery(entry.browserUrl, searchQuery)
  return (
    <article
      className={`skill-card${isSelected ? ' selected' : ''}`}
      id={`skill-${entry.skillId}`}
      ref={isSelected ? selectedSkillRef : null}
    >
      <div className="skill-copy">
        <a className="skill-title" href={browserUrl} onClick={onNavigate(browserUrl)}>
          {entry.domainOrder}.{entry.skillOrder} {entry.skillLabel}
        </a>
        <div className="skill-availability" aria-label="Content availability">
          <span>{entry.practiceQuestionCount} {entry.practiceQuestionCount === 1 ? 'question' : 'questions'}</span>
          <span>{entry.tutorAvailable ? 'AI tutor available' : 'AI tutor not yet available'}</span>
        </div>
        <details className="skill-description">
          <summary>Description</summary>
          <p>{entry.skillDescription}</p>
        </details>
      </div>
      <div className="skill-actions">
        {entry.practiceAvailable ? (
          <a className="skill-practice-button" href={entry.practiceUrl} onClick={onNavigate(entry.practiceUrl)}>
            Practice this skill
          </a>
        ) : (
          <span className="skill-action-unavailable">
            Practice unavailable <small>No questions yet</small>
          </span>
        )}
        {entry.tutorAvailable ? (
          <a className="skill-ai-button enabled" href={entry.tutorUrl} onClick={onNavigate(entry.tutorUrl)}>
            Teach me this skill
          </a>
        ) : (
          <span className="skill-action-unavailable">
            Skill tutor <small>Coming soon</small>
          </span>
        )}
      </div>
    </article>
  )
}

export function TopicBrowserPage({ topic, domainId, skillId, searchQuery = '', onSearchChange, onNavigate }) {
  const target = resolveSubjectLocation(topic?.slug, { domainId, skillId })
  const [expandedDomains, setExpandedDomains] = useState(() => new Set(
    target.domain ? [target.domain.id] : [],
  ))
  const selectedSkillRef = useRef(null)
  const searchInputRef = useRef(null)
  const selectedSkillId = target.skill?.id
  const safeSearchQuery = sanitizeSkillSearchQuery(searchQuery)
  const normalizedSearchQuery = normalizeSearchText(safeSearchQuery)
  const isSearchActive = Boolean(normalizedSearchQuery)
  const hasInvalidSearchText = Boolean(safeSearchQuery.trim()) && !isSearchActive
  const searchResults = useMemo(
    () => (isSearchActive ? searchSkills(safeSearchQuery, { subjectId: topic?.slug }) : []),
    [isSearchActive, safeSearchQuery, topic?.slug],
  )
  const groupedSearchResults = useMemo(() => {
    const groups = []
    searchResults.forEach((entry) => {
      let group = groups.find((item) => item.domainId === entry.domainId)
      if (!group) {
        group = { domainId: entry.domainId, domainLabel: entry.domainLabel, results: [] }
        groups.push(group)
      }
      group.results.push(entry)
    })
    return groups
  }, [searchResults])

  useEffect(() => {
    if (!selectedSkillId) return
    window.requestAnimationFrame(() => selectedSkillRef.current?.scrollIntoView({ block: 'center' }))
  }, [selectedSkillId])

  if (!topic || topic.slug !== 'sat-math' || target.status === 'invalid-subject') {
    return (
      <main className="page topic-browser-empty">
        <h1>Unit browser not found</h1>
        <p>This test does not have a unit browser yet.</p>
        <a href="/index.html" onClick={onNavigate('/index.html')}>Return to search</a>
      </main>
    )
  }

  if (target.status === 'invalid-target') {
    return (
      <main className="page topic-browser-empty">
        <p className="topic-browser-eyebrow">{topic.title}</p>
        <h1>Skill not found</h1>
        <p>That unit or skill is not part of SAT Math.</p>
        <a href="/topics.html?topic=sat-math" onClick={onNavigate('/topics.html?topic=sat-math')}>
          Browse all SAT Math units
        </a>
      </main>
    )
  }

  function toggleDomain(nextDomainId) {
    setExpandedDomains((current) => {
      const next = new Set(current)
      if (next.has(nextDomainId)) next.delete(nextDomainId)
      else next.add(nextDomainId)
      return next
    })
  }

  function clearSearch() {
    onSearchChange('')
    window.requestAnimationFrame(() => searchInputRef.current?.focus())
  }

  return (
    <main className="page topic-browser-page">
      <header className="topic-browser-header">
        <p className="topic-browser-eyebrow">{topic.title}</p>
        <h1>SAT Math units and skills</h1>
        <p>Start with the full test tutor, or browse units and skills when you need focused help.</p>
      </header>

      <section className="skill-search-panel" aria-labelledby="skill-search-heading">
        <div className="skill-search-heading">
          <div>
            <h2 id="skill-search-heading">Find a skill</h2>
            <p>Search skill names, descriptions, aliases, tags, or units.</p>
          </div>
          {safeSearchQuery ? <button type="button" className="skill-search-clear" onClick={clearSearch}>Clear search</button> : null}
        </div>
        <label htmlFor="skill-search-input">Search SAT Math skills</label>
        <input
          id="skill-search-input"
          ref={searchInputRef}
          type="search"
          value={safeSearchQuery}
          maxLength="100"
          placeholder="Try slope, triangles, or solve for x"
          autoComplete="off"
          onChange={(event) => onSearchChange(sanitizeSkillSearchQuery(event.target.value))}
        />
        <p className="skill-search-status" role="status" aria-live="polite">
          {isSearchActive
            ? `${searchResults.length} ${searchResults.length === 1 ? 'skill' : 'skills'} found for “${safeSearchQuery.trim()}”.`
            : hasInvalidSearchText
              ? 'Enter at least one letter or number to search.'
              : 'Enter a search, or browse the four units below.'}
        </p>
      </section>

      {isSearchActive ? (
        <div className="skill-search-results" aria-label="Skill search results">
          {groupedSearchResults.length ? groupedSearchResults.map((group) => (
            <section className="search-domain-group domain-card" key={group.domainId}>
              <h2>
                <span>{group.domainLabel}</span>
                <small>{group.results.length} {group.results.length === 1 ? 'match' : 'matches'}</small>
              </h2>
              <div className="skill-list">
                {group.results.map((entry) => (
                  <SkillCatalogCard
                    key={entry.skillId}
                    entry={entry}
                    isSelected={selectedSkillId === entry.skillId}
                    selectedSkillRef={selectedSkillRef}
                    searchQuery={safeSearchQuery}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </section>
          )) : (
            <div className="skill-search-empty">
              <h2>No matching skills</h2>
              <p>Try a broader term, a unit such as “geometry,” or an alias such as “solve for x.”</p>
              <button type="button" onClick={clearSearch}>Clear search and browse units</button>
            </div>
          )}
        </div>
      ) : <div className="domain-list">
        {target.subject.domains.map((domain) => {
          const isExpanded = expandedDomains.has(domain.id) || target.domain?.id === domain.id
          const domainTutorUrl = createDomainTutorUrl(topic.slug, domain.id)
          return (
            <section className="domain-card" key={domain.id}>
              <button
                type="button"
                className="domain-toggle"
                aria-expanded={isExpanded}
                aria-controls={`domain-skills-${domain.id}`}
                onClick={() => toggleDomain(domain.id)}
              >
                <span className="domain-number">{String(domain.order).padStart(2, '0')}</span>
                <span className="domain-heading">
                  <strong>{domain.label}</strong>
                  <span>{domain.description}</span>
                </span>
                <span className="domain-skill-count">{domain.skills.length} skills</span>
                <span className="domain-chevron" aria-hidden="true">{isExpanded ? '−' : '+'}</span>
              </button>

              {domainTutorUrl ? (
                <div className="domain-ai-row">
                  <a href={domainTutorUrl} onClick={onNavigate(domainTutorUrl)}>Teach me this unit</a>
                </div>
              ) : null}

              {isExpanded ? (
                <div className="skill-list" id={`domain-skills-${domain.id}`}>
                  {domain.skills.map((skill) => {
                    const isSelected = target.skill?.id === skill.id
                    const entry = getSkillCatalogEntry(topic.slug, skill.id)
                    return (
                      <SkillCatalogCard
                        key={skill.id}
                        entry={entry}
                        isSelected={isSelected}
                        selectedSkillRef={selectedSkillRef}
                        searchQuery=""
                        onNavigate={onNavigate}
                      />
                    )
                  })}
                </div>
              ) : null}
            </section>
          )
        })}
      </div>}

      <div className="topic-back-wrap">
        <a href={`/topic.html?topic=${topic.slug}`} onClick={onNavigate(`/topic.html?topic=${topic.slug}`)}>
          Back to SAT Math overview
        </a>
      </div>
    </main>
  )
}

export function AboutPage() {
  return (
    <main className="page">
      <section className="content-card">
        <h1>About this project</h1>
        <p>
          This website is a starter project for building an AI-powered study tool.
          The goal is to help students prepare for AP exams, SATs, MAPs, and other
          standardized tests.
        </p>
        <p>
          You can add features later like practice questions, study plans, flashcards,
          and AI chat support.
        </p>
      </section>
    </main>
  )
}

export function ContactsPage() {
  return (
    <main className="page">
      <section className="content-card">
        <h1>Contact</h1>
        <p>
          Add your email, social links, or a contact form here when you are ready.
        </p>
        <p>
          For now, this page is a placeholder so the navigation bar has working links.
        </p>
      </section>
    </main>
  )
}
