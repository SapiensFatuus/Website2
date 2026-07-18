import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const chatPage = readFileSync(new URL('./ChatPage.jsx', import.meta.url), 'utf8')
const chatStyles = readFileSync(new URL('./ChatPage.css', import.meta.url), 'utf8')

test('chat UI stays free of manual scope and source controls', () => {
  const removedUi = [
    'Choose tutoring scope',
    'This skill',
    'This unit',
    'Entire test',
    'Jump to a unit',
    'Local material used',
    'Answered without a local sample source',
    'chat-scope-panel',
  ]
  removedUi.forEach((text) => {
    assert.equal(chatPage.includes(text), false, `${text} should not appear in ChatPage`)
    assert.equal(chatStyles.includes(text), false, `${text} should not appear in ChatPage.css`)
  })
})

test('chat UI identifies the test tutor and keeps only conversational guidance', () => {
  assert.match(chatPage, /subject\.label} Tutor/)
  assert.match(chatPage, /I’ll focus on whatever you need/)
  assert.match(chatPage, /Your question/)
  assert.match(chatPage, /Attach homework photo/)
  assert.match(chatPage, /chat-sources/)
})
