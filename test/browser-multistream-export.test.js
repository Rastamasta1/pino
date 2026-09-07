'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')

const browser = require('../browser.js')
const libMultistream = require('../lib/browser-multistream.js')

test('browser.js exposes the lib/browser-multistream multistream function', () => {
  assert.equal(typeof browser.multistream, 'function')
  assert.strictEqual(browser.multistream, libMultistream.multistream)
})
