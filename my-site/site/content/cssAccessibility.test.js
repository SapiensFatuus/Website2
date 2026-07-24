import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const appCss = readFileSync(new URL('../App.css', import.meta.url), 'utf8')
const questionCss = readFileSync(new URL('../questions/QuestionPage.css', import.meta.url), 'utf8')

function luminance(hex) {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
    .map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2])
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = luminance(foreground)
  const backgroundLuminance = luminance(background)
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
}

test('primary question actions and score labels meet normal-text contrast', () => {
  assert.ok(contrastRatio('#ffffff', '#b3261e') >= 4.5)
  assert.ok(contrastRatio('#ad4300', '#ffffff') >= 4.5)
  assert.match(questionCss, /\.question-primary-button\s*\{[^}]*background:\s*#b3261e/s)
  assert.match(questionCss, /\.score-orange\s*\{\s*color:\s*#ad4300/)
})

test('search and study-resource controls have explicit visible keyboard focus', () => {
  assert.match(appCss, /\.search-input:focus\s*\{[^}]*outline:\s*3px solid #ffd54f/s)
  assert.match(appCss, /\.study-resource-page a:focus-visible,[\s\S]*outline:\s*3px solid #5c47a8/)
})

test('the shared app honors reduced-motion preferences for animation and transitions', () => {
  assert.match(appCss, /@media \(prefers-reduced-motion: reduce\)/)
  assert.match(appCss, /animation-duration:\s*0\.01ms !important/)
  assert.match(appCss, /transition-duration:\s*0\.01ms !important/)
  assert.match(appCss, /scroll-behavior:\s*auto !important/)
})
