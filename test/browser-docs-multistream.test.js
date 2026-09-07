'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')

const docsPath = join(__dirname, '..', 'docs', 'browser.md')
const docs = readFileSync(docsPath, 'utf8')

test('docs/browser.md documents pino.multistream() browser support', () => {
  assert.ok(
    docs.includes('pino.multistream()'),
    "expected docs/browser.md to contain 'pino.multistream()'"
  )
})

test('docs/browser.md no longer claims the second destination argument is ignored', () => {
  assert.ok(
    !docs.includes('the second argument is ignored, not honoured'),
    "docs/browser.md must not contain 'the second argument is ignored, not honoured'"
  )
})

test('docs/browser.md no longer lists multistream as Node.js-only', () => {
  assert.ok(
    !docs.includes('Fans out to multiple destination streams.'),
    "docs/browser.md must not contain 'Fans out to multiple destination streams.'"
  )
})
