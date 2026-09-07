'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')

const { multistream } = require('../lib/browser-multistream.js')

function fakeDest () {
  const chunks = []
  return {
    chunks,
    write (chunk) {
      chunks.push(chunk)
    }
  }
}

test('write forwards a chunk to every destination', () => {
  const destA = fakeDest()
  const destB = fakeDest()

  const ms = multistream([destA, destB])
  ms.write('hello\n')

  assert.deepEqual(destA.chunks, ['hello\n'])
  assert.deepEqual(destB.chunks, ['hello\n'])
})

test('exposes write and add as functions', () => {
  const ms = multistream([fakeDest()])

  assert.equal(typeof ms.write, 'function')
  assert.equal(typeof ms.add, 'function')
})

test('add appends a destination that receives subsequent writes', () => {
  const destA = fakeDest()
  const destB = fakeDest()
  const destC = fakeDest()

  const ms = multistream([destA, destB])
  ms.add(destC)
  ms.write('hello\n')

  assert.deepEqual(destA.chunks, ['hello\n'])
  assert.deepEqual(destB.chunks, ['hello\n'])
  assert.deepEqual(destC.chunks, ['hello\n'])
})
