export function Topbar({ pageClassName, showCounters, stats, onNavigate }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-icon" aria-hidden="true">AI</div>
        <span>Study AI Helper</span>
      </div>
      {showCounters ? (
        <div className="topbar-counters" aria-label="Live user stats">
          <span className="counter-item">
            <span className="counter-label">Active:</span>
            <span className="counter-value" id="activeUsers">{stats.activeUsers}</span>
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

export function TopicPage({ topic, stats, onActionClick, onNavigate }) {
  return (
    <main className="page">
      <section className="topic-hero">
        <div className="topic-hero-copy">
          <h1 id="topicTitle">{topic ? topic.title : 'Topic not found'}</h1>
        </div>

        <aside className="topic-overview-card">
          <div className="topic-stat-row">
            <div className="topic-stat-item">
              <div className="topic-stat-label">Sections</div>
              <div className="topic-stat-value" id="topicSections">{topic ? stats.sections : '-'}</div>
            </div>
            <div className="topic-stat-item">
              <div className="topic-stat-label">Pass Rate</div>
              <div className="topic-stat-value" id="topicPassRate">{topic ? stats.passRate : '-'}</div>
            </div>
            <div className="topic-stat-item">
              <div className="topic-stat-label">5 Rate</div>
              <div className="topic-stat-value" id="topicFiveRate">{topic ? stats.fiveRate : '-'}</div>
            </div>
          </div>
        </aside>
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

        <button className="topic-action-btn" data-method="Ask Questions" type="button" onClick={onActionClick}>
          Ask Questions
        </button>

        <button className="topic-action-btn" data-method="Practice Questions" type="button" onClick={onActionClick}>
          Practice Questions
        </button>

        <button className="topic-action-btn" data-method="View Topics" type="button" onClick={onActionClick}>
          View Topics
        </button>
      </section>

      <div className="topic-back-wrap">
        <a href="/index.html" className="topic-back-link" onClick={onNavigate('/index.html')}>
          Back to search
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
