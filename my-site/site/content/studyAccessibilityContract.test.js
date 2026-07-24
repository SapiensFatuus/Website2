import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const questionPage = readFileSync(new URL('../questions/QuestionPage.jsx', import.meta.url), 'utf8')
const resourcePage = readFileSync(new URL('./StudyResourcePage.jsx', import.meta.url), 'utf8')

test('question transitions move screen-reader focus to the newly displayed prompt', () => {
  assert.match(questionPage, /questionPromptRef\.current\?\.focus/)
  assert.match(questionPage, /id="question-prompt" ref=\{questionPromptRef\} tabIndex="-1"/)
})

test('the countdown remains queryable without announcing every second', () => {
  assert.match(questionPage, /role="timer"/)
  assert.match(questionPage, /aria-live="off"/)
  assert.match(questionPage, /Less than one minute remaining/)
  assert.doesNotMatch(questionPage, /session-timer[^>]*aria-live="polite"/)
})

test('FRQ instructions truthfully describe manual self-review and automatic-score exclusion', () => {
  assert.match(questionPage, /point-by-point draft rubric for self-review/)
  assert.match(questionPage, /not automatically scored and is excluded from the selected-response percentage/)
  assert.doesNotMatch(questionPage, /marked incorrect in this first version/)
})

test('formula variable tables expose a caption and explicit row and column headers', () => {
  assert.match(resourcePage, /<caption className="sr-only">Variable definitions for \{resource\.title\}<\/caption>/)
  assert.match(resourcePage, /<th scope="col">Symbol<\/th>/)
  assert.match(resourcePage, /<th scope="row">\{variable\.symbol\}<\/th>/)
})
