import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import {
  createSkillBrowserUrl,
  createSkillChatUrl,
  createSkillPracticeUrl,
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
        <h1>What do you want to study?</h1>
        <input
          type="text"
          id="searchInput"
          className="search-input"
          placeholder="Search topics (e.g., SAT: Math, AP Chemistry)..."
          aria-label="Search study topics"
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
            <div className="search-no-results">No topics found</div>
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
    helpText: 'Ask for explanations, step-by-step help, or quick clarification on this topic.',
  },
  {
    label: 'Practice Questions',
    helpText: 'Try sample questions to check your understanding and spot weak areas.',
  },
  {
    label: 'View Topics',
    helpText: 'Go back to the full topic list and pick something else to study.',
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
          <h1 id="topicTitle">{topic ? topic.title : 'Topic not found'}</h1>
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
            {topic ? topic.summary : 'The topic you selected does not exist yet.'}
          </p>
        </div>
      </section>

      <section className="topic-actions" aria-label="Learning options">
        <div className="topic-actions-intro">
          Choose the best way to learn this topic.
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
              {action.label}
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

export function TopicBrowserPage({ topic, domainId, skillId, onNavigate }) {
  const target = resolveSubjectLocation(topic?.slug, { domainId, skillId })
  const [expandedDomains, setExpandedDomains] = useState(() => new Set(
    target.domain ? [target.domain.id] : [],
  ))
  const selectedSkillRef = useRef(null)
  const selectedSkillId = target.skill?.id

  useEffect(() => {
    if (!selectedSkillId) return
    window.requestAnimationFrame(() => selectedSkillRef.current?.scrollIntoView({ block: 'center' }))
  }, [selectedSkillId])

  if (!topic || topic.slug !== 'sat-math' || target.status === 'invalid-subject') {
    return (
      <main className="page topic-browser-empty">
        <h1>Topic browser not found</h1>
        <p>This subject does not have a topic browser yet.</p>
        <a href="/index.html" onClick={onNavigate('/index.html')}>Return to search</a>
      </main>
    )
  }

  if (target.status === 'invalid-target') {
    return (
      <main className="page topic-browser-empty">
        <p className="topic-browser-eyebrow">{topic.title}</p>
        <h1>Skill not found</h1>
        <p>That domain or skill is not part of the current SAT Math taxonomy.</p>
        <a href="/topics.html?topic=sat-math" onClick={onNavigate('/topics.html?topic=sat-math')}>
          Browse all SAT Math topics
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

  return (
    <main className="page topic-browser-page">
      <header className="topic-browser-header">
        <p className="topic-browser-eyebrow">{topic.title}</p>
        <h1>Topics and skills</h1>
        <p>Choose a domain, then pick a skill to practice. Only one domain needs to be open at a time.</p>
      </header>

      <div className="domain-list">
        {target.subject.domains.map((domain) => {
          const isExpanded = expandedDomains.has(domain.id)
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

              {isExpanded ? (
                <div className="skill-list" id={`domain-skills-${domain.id}`}>
                  {domain.skills.map((skill) => {
                    const isSelected = target.skill?.id === skill.id
                    return (
                      <article
                        className={`skill-card${isSelected ? ' selected' : ''}`}
                        id={`skill-${skill.id}`}
                        key={skill.id}
                        ref={isSelected ? selectedSkillRef : null}
                      >
                        <div className="skill-copy">
                          <a
                            className="skill-title"
                            href={createSkillBrowserUrl(topic.slug, skill.id)}
                            onClick={onNavigate(createSkillBrowserUrl(topic.slug, skill.id))}
                          >
                            {domain.order}.{skill.order} {skill.label}
                          </a>
                          <details className="skill-description">
                            <summary>Description</summary>
                            <p>{skill.description}</p>
                          </details>
                        </div>
                        <div className="skill-actions">
                          <a
                            className="skill-practice-button"
                            href={createSkillPracticeUrl(topic.slug, skill.id)}
                            onClick={onNavigate(createSkillPracticeUrl(topic.slug, skill.id))}
                          >
                            Practice this skill
                          </a>
                          {skill.tutor ? (
                            <a
                              className="skill-ai-button enabled"
                              href={createSkillChatUrl(topic.slug, skill.id)}
                              onClick={onNavigate(createSkillChatUrl(topic.slug, skill.id))}
                            >
                              Ask AI <span>Prototype</span>
                            </a>
                          ) : (
                            <button type="button" className="skill-ai-button" disabled>
                              Ask AI <span>Coming soon</span>
                            </button>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : null}
            </section>
          )
        })}
      </div>

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
