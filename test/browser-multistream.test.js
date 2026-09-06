'use strict'
const test = require('tape')
const pino = require('../browser')

test('pino.multistream is a function on the browser export', ({ end, is }) => {
  is(typeof pino.multistream, 'function')
  end()
})

test('fans out to entries by level, filtering below entry level', ({ end, same }) => {
  const infoLogs = []
  const errorLogs = []
  const ms = pino.multistream([
    { stream: { write (o) { infoLogs.push(o) } }, level: 'info' },
    { stream: { write (o) { errorLogs.push(o) } }, level: 'error' }
  ])

  const infoRecord = { level: 30, msg: 'i' }
  const errorRecord = { level: 50, msg: 'e' }

  ms.write(infoRecord)
  ms.write(errorRecord)

  same(infoLogs, [infoRecord, errorRecord])
  same(errorLogs, [errorRecord])
  end()
})

test('an entry with an unknown level label throws and the message contains the label', ({ end, throws }) => {
  throws(() => {
    pino.multistream([{ stream: { write () {} }, level: 'bogus' }])
  }, /bogus/)
  end()
})

test('minLevel is the lowest level and add() of a lower entry lowers it and re-sorts streams', ({ end, is }) => {
  const ms = pino.multistream([
    { stream: { write () {} }, level: 'warn' },
    { stream: { write () {} }, level: 'error' }
  ])

  is(ms.minLevel, pino.levels.values.warn)
  is(ms.streams[0].level, pino.levels.values.warn)

  ms.add({ stream: { write () {} }, level: 'debug' })

  is(ms.minLevel, pino.levels.values.debug)
  is(ms.streams[0].level, pino.levels.values.debug)
  end()
})

test('a bare { write } entry defaults to level info', ({ end, is }) => {
  const ms = pino.multistream({ write () {} })
  is(ms.streams.length, 1)
  is(ms.streams[0].level, pino.levels.values.info)
  is(ms.minLevel, pino.levels.values.info)
  end()
})
