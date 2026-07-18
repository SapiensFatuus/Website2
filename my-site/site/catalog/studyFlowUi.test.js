import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const components = readFileSync(new URL('../components.jsx', import.meta.url), 'utf8')
const appStyles = readFileSync(new URL('../App.css', import.meta.url), 'utf8')
const questionStyles = readFileSync(new URL('../questions/QuestionPage.css', import.meta.url), 'utf8')

test('test overview uses a compact action row with one clear tutor action', () => {
  assert.match(components, /topic-action-row/)
  assert.match(components, /Ask the \$\{testTutorName\} Tutor/)
  assert.doesNotMatch(components, /topic-action-card\$\{action\.label === 'Ask Questions' \? ' primary'/)
  assert.doesNotMatch(appStyles, /topic-action-card\.primary/)
  assert.doesNotMatch(components, /topic-action-help/)
})

test('study-flow styles keep compact controls and responsive stacking', () => {
  assert.match(appStyles, /\.topic-action-btn[\s\S]*?min-height: 44px/)
  assert.match(appStyles, /\.topic-action-row[\s\S]*?flex-wrap: wrap/)
  assert.match(appStyles, /\.skill-search-panel[\s\S]*?padding: 12px 14px/)
  assert.match(questionStyles, /\/\* Compact study flow \*\//)
  assert.match(questionStyles, /\.question-session-header[\s\S]*?min-height: 58px/)
})

test('typed answers have a generous focus target and guest ribbons stay hidden', () => {
  const questionPage = readFileSync(new URL('../questions/QuestionPage.jsx', import.meta.url), 'utf8')
  assert.match(questionPage, /onClick=\{\(\) => typedResponseRef\.current\?\.focus\(\)\}/)
  assert.match(questionPage, /aria-describedby="typed-response-help"/)
  assert.doesNotMatch(questionPage, /practice-progress-note/)
  assert.match(questionStyles, /\.typed-answer input[\s\S]*?max-width: 420px[\s\S]*?min-height: 50px/)
  assert.match(questionStyles, /touch-action: manipulation/)
})
