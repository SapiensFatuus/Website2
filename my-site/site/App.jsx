import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { startTracker } from './firebaseTracker'
import { trackEvent } from './firebase'
import { AboutPage, ContactsPage, HomePage, TopicBrowserPage, TopicPage, Topbar } from './components'
import { findTopicBySlug, topics } from './siteData'
import { QuestionPage } from './questions/QuestionPage'
import { getPracticeFilters } from './taxonomy/contentTaxonomy'
import { ChatPage } from './chat/ChatPage'

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
    const topic = findTopicBySlug(params.get('topic'))
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
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return []
    }

    return topics.filter((topic) => topic.title.toLowerCase().includes(normalizedQuery))
  }, [query])

  const selectedTopic = useMemo(() => {
    if (!['page-topic', 'page-topic-browser', 'page-questions', 'page-chat'].includes(currentPageClassName)) {
      return null
    }

    const params = new URLSearchParams(route.search)
    return findTopicBySlug(params.get('topic'))
  }, [currentPageClassName, route.search])

  function navigateTo(path) {
    window.history.pushState({}, '', path)
    applyRoute(getCurrentLocation())
    window.scrollTo({ top: 0, behavior: 'auto' })
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

    if (method === 'View Topics') {
      navigateTo(selectedTopic?.slug === 'sat-math' ? '/topics.html?topic=sat-math' : '/index.html')
      return
    }

    if (method === 'Practice Questions' && selectedTopic) {
      navigateTo(`/questions.html?topic=${selectedTopic.slug}`)
      return
    }

    window.alert(`You selected: ${method}\n\nThis feature is coming soon! For now, this is a placeholder.`)
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
        <TopicBrowserPage
          key={route.search}
          topic={selectedTopic}
          domainId={new URLSearchParams(route.search).get('domain')}
          skillId={new URLSearchParams(route.search).get('skill')}
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
        <ChatPage
          key={route.search}
          examId={new URLSearchParams(route.search).get('exam')}
          subjectId={new URLSearchParams(route.search).get('topic')}
          domainId={new URLSearchParams(route.search).get('domain')}
          skillId={new URLSearchParams(route.search).get('skill')}
          onNavigate={navigateTo}
        />
      ) : null}
      {currentPageClassName === 'page-about' ? <AboutPage /> : null}
      {currentPageClassName === 'page-contacts' ? <ContactsPage /> : null}
    </div>
  )
}

export default App
