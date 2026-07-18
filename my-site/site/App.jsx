import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { startTracker } from './firebaseTracker'
import { trackEvent } from './firebase'
import { AboutPage, ContactsPage, HomePage, TopicBrowserPage, TopicPage, Topbar } from './components'
import { findTopicBySlug, topics } from './siteData'
import { QuestionPage } from './questions/QuestionPage'
import { getPracticeFilters } from './taxonomy/contentTaxonomy'
import { sanitizeSkillSearchQuery } from './catalog/skillSearch'
import { searchTests } from './catalog/testSearch'
import { createSubjectTutorUrl } from './chat/tutorScopes'

const ChatPage = lazy(() => import('./chat/ChatPage').then((module) => ({ default: module.ChatPage })))

function getCurrentLocation() {
  return {
    pathname: window.location.pathname || '/index.html',
    search: window.location.search || '',
  }
}

function normalizePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/index.html'
  }

  return pathname
}

function getPageClassName(pathname) {
  const normalizedPath = normalizePath(pathname)

  if (normalizedPath.endsWith('/about.html') || normalizedPath === '/about.html') {
    return 'page-about'
  }

  if (normalizedPath.endsWith('/contacts.html') || normalizedPath === '/contacts.html') {
    return 'page-contacts'
  }

  if (normalizedPath.endsWith('/topic.html') || normalizedPath === '/topic.html') {
    return 'page-topic'
  }

  if (normalizedPath.endsWith('/questions.html') || normalizedPath === '/questions.html') {
    return 'page-questions'
  }

  if (normalizedPath.endsWith('/topics.html') || normalizedPath === '/topics.html') {
    return 'page-topic-browser'
  }

  if (normalizedPath.endsWith('/chat.html') || normalizedPath === '/chat.html') {
    return 'page-chat'
  }

  return 'page-home'
}

function App() {
  const [query, setQuery] = useState('')
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [route, setRoute] = useState(getCurrentLocation)
  const [stats, setStats] = useState({
    activeUsers: 0,
    peakActiveUsers: 0,
    totalUsers: 0,
    totalVisits: 0,
  })
  const searchDropdownRef = useRef(null)
  const currentPageClassName = getPageClassName(route.pathname)

  function applyRoute(nextRoute) {
    const nextPageClassName = getPageClassName(nextRoute.pathname)

    if (nextPageClassName !== 'page-home') {
      setQuery('')
      setIsDropdownVisible(false)
    }

    setRoute(nextRoute)
  }

  useEffect(() => {
    const stopTracking = startTracker(
      (nextStats) => {
        setStats(nextStats)
      },
      (error) => {
        console.error(error)
      },
    )

    return () => {
      stopTracking()
    }
  }, [])

  useEffect(() => {
    function handlePopState() {
      applyRoute(getCurrentLocation())
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    document.body.className = currentPageClassName

    if (currentPageClassName === 'page-home') {
      document.title = 'Website 2'
      return
    }

    if (currentPageClassName === 'page-about') {
      document.title = 'About | Study AI Helper'
      return
    }

    if (currentPageClassName === 'page-contacts') {
      document.title = 'Contacts | Study AI Helper'
      return
    }

    const params = new URLSearchParams(route.search)
    const topic = findTopicBySlug(params.get('test') || params.get('topic'))
    document.title = topic
      ? `${currentPageClassName === 'page-questions' ? 'Questions · ' : ''}${topic.title} | Study AI Helper`
      : 'Topic Not Found | Study AI Helper'
  }, [currentPageClassName, route.search])

  useEffect(() => {
    if (currentPageClassName !== 'page-home' || !query.trim()) {
      return undefined
    }

    function handleDocumentClick(event) {
      if (event.target?.id === 'searchInput') {
        return
      }

      if (searchDropdownRef.current?.contains(event.target)) {
        return
      }

      setIsDropdownVisible(false)
    }

    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [currentPageClassName, query])

  const results = useMemo(() => {
    return searchTests(topics, query)
  }, [query])

  const selectedTopic = useMemo(() => {
    if (!['page-topic', 'page-topic-browser', 'page-questions', 'page-chat'].includes(currentPageClassName)) {
      return null
    }

    const params = new URLSearchParams(route.search)
    return findTopicBySlug(params.get('test') || params.get('topic'))
  }, [currentPageClassName, route.search])

  function navigateTo(path) {
    window.history.pushState({}, '', path)
    const nextRoute = getCurrentLocation()
    applyRoute(nextRoute)
    window.scrollTo({ top: 0, behavior: 'auto' })

    if (getPageClassName(nextRoute.pathname) === 'page-home') {
      window.requestAnimationFrame(() => document.getElementById('searchInput')?.focus())
    }
  }

  function replaceRoute(path) {
    window.history.replaceState({}, '', path)
    applyRoute(getCurrentLocation())
  }

  function createNavigationHandler(path) {
    return (event) => {
      event.preventDefault()
      navigateTo(path)
    }
  }

  function handleTopicSelect(topic) {
    setIsDropdownVisible(false)
    navigateTo(`/topic.html?topic=${topic.slug}`)

    void trackEvent('select_content', {
      content_type: 'study_topic',
      item_id: topic.slug,
      item_name: topic.title,
    })
  }

  function handleSearchKeyDown(event) {
    if (event.key === 'Escape') {
      setIsDropdownVisible(false)
    }
  }

  function handleQueryChange(nextQuery) {
    setQuery(nextQuery)
    setIsDropdownVisible(nextQuery.trim().length > 0)
  }

  function handleTopicActionClick(event) {
    const method = event.currentTarget.getAttribute('data-method')

    if (method === 'Ask Questions' && selectedTopic) {
      const tutorUrl = createSubjectTutorUrl(selectedTopic.slug)
      if (tutorUrl) {
        navigateTo(tutorUrl)
        return
      }
    }

    if (method === 'View Topics') {
      navigateTo(selectedTopic ? `/topics.html?topic=${selectedTopic.slug}` : '/index.html')
      return
    }

    if (method === 'Practice Questions' && selectedTopic) {
      navigateTo(`/questions.html?topic=${selectedTopic.slug}`)
      return
    }

    window.alert(`You selected: ${method}\n\nThis feature is coming soon! For now, this is a placeholder.`)
  }

  function handleSkillSearchChange(nextQuery) {
    const params = new URLSearchParams({ topic: selectedTopic?.slug || 'sat-math' })
    const safeQuery = sanitizeSkillSearchQuery(nextQuery)
    if (safeQuery) params.set('q', safeQuery)
    replaceRoute(`/topics.html?${params.toString()}`)
  }

  return (
    <div className={`site-shell ${currentPageClassName}`}>
      {currentPageClassName !== 'page-questions' ? (
        <Topbar
          pageClassName={currentPageClassName}
          showCounters={currentPageClassName === 'page-home'}
          stats={stats}
          onNavigate={createNavigationHandler}
        />
      ) : null}
      {currentPageClassName === 'page-home' ? (
        <HomePage
          query={query}
          results={results}
          showDropdown={isDropdownVisible && query.trim().length > 0}
          onQueryChange={handleQueryChange}
          onSearchKeyDown={handleSearchKeyDown}
          onTopicSelect={handleTopicSelect}
          searchDropdownRef={searchDropdownRef}
        />
      ) : null}
      {currentPageClassName === 'page-topic' ? (
        <TopicPage
          topic={selectedTopic}
          onActionClick={handleTopicActionClick}
          onNavigate={createNavigationHandler}
        />
      ) : null}
      {currentPageClassName === 'page-topic-browser' ? (
        // Keep this component mounted while q changes so typing does not lose focus.
        <TopicBrowserPage
          topic={selectedTopic}
          domainId={new URLSearchParams(route.search).get('domain')}
          skillId={new URLSearchParams(route.search).get('skill')}
          searchQuery={new URLSearchParams(route.search).get('q') || ''}
          onSearchChange={handleSkillSearchChange}
          onNavigate={createNavigationHandler}
        />
      ) : null}
      {currentPageClassName === 'page-questions' ? (
        <QuestionPage
          key={route.search}
          topic={selectedTopic}
          initialFilters={getPracticeFilters(selectedTopic?.slug, {
            domainId: new URLSearchParams(route.search).get('domain'),
            skillId: new URLSearchParams(route.search).get('skill'),
          })}
          onNavigate={navigateTo}
        />
      ) : null}
      {currentPageClassName === 'page-chat' ? (
        <Suspense fallback={<main className="chat-empty-page"><p>Loading math tutor…</p></main>}>
          <ChatPage
            examId={new URLSearchParams(route.search).get('exam')}
            subjectId={new URLSearchParams(route.search).get('test') || new URLSearchParams(route.search).get('topic')}
            scope={new URLSearchParams(route.search).get('scope')}
            domainId={new URLSearchParams(route.search).get('unit') || new URLSearchParams(route.search).get('domain')}
            skillId={new URLSearchParams(route.search).get('skill')}
            returnTo={new URLSearchParams(route.search).get('from')}
            onNavigate={navigateTo}
          />
        </Suspense>
      ) : null}
      {currentPageClassName === 'page-about' ? <AboutPage /> : null}
      {currentPageClassName === 'page-contacts' ? <ContactsPage /> : null}
    </div>
  )
}

export default App
