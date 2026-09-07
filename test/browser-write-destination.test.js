'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')

const pino = require('../browser.js')

test('destination object with a write function receives browser log output', () => {
  const received = []
  const destination = {
    write (chunk) {
      received.push(chunk)
    }
  }

  const logger = pino({}, destination)
  logger.info('to dest')

  assert.equal(received.length, 1)
  const recorded = received[0]
  const asString = typeof recorded === 'string' ? recorded : JSON.stringify(recorded)
  assert.ok(asString.includes('to dest'), `expected recorded value to contain 'to dest', got ${asString}`)
})

test('absent destination keeps console behaviour (write is not called)', () => {
  const logger = pino({})
  // Should not throw and should not require a destination.
  assert.doesNotThrow(() => logger.info('no destination'))
})

test('destination without a write function is ignored, console behaviour unchanged', () => {
  const notAWriter = { notWrite: true }
  const logger = pino({}, notAWriter)
  assert.doesNotThrow(() => logger.info('to nowhere'))
})

test('a pino.multistream(...) result is usable as a browser destination', () => {
  const chunksA = []
  const chunksB = []
  const destA = { write (c) { chunksA.push(c) } }
  const destB = { write (c) { chunksB.push(c) } }
  const ms = pino.multistream([destA, destB])

  const logger = pino({}, ms)
  logger.info('to dest')

  assert.equal(chunksA.length, 1)
  assert.equal(chunksB.length, 1)
  const asStringA = typeof chunksA[0] === 'string' ? chunksA[0] : JSON.stringify(chunksA[0])
  const asStringB = typeof chunksB[0] === 'string' ? chunksB[0] : JSON.stringify(chunksB[0])
  assert.ok(asStringA.includes('to dest'))
  assert.ok(asStringB.includes('to dest'))
})
