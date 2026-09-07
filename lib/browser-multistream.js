'use strict'

// Browser-safe multistream: mirrors the public shape of pino's Node
// multistream (write fan-out + add()) without requiring any Node core
// modules or sonic-boom, so this file is safe to bundle for the browser.

function normalizeDest (dest) {
  if (dest && typeof dest.write === 'function') {
    return dest
  }
  if (dest && dest.stream && typeof dest.stream.write === 'function') {
    return dest.stream
  }
  return dest
}

function multistream (streamsArray) {
  const streams = []

  function add (dest) {
    if (!dest) {
      return res
    }
    streams.push(normalizeDest(dest))
    return res
  }

  function write (chunk) {
    for (let i = 0; i < streams.length; i++) {
      streams[i].write(chunk)
    }
  }

  const res = {
    write,
    add,
    streams
  }

  if (Array.isArray(streamsArray)) {
    streamsArray.forEach(add)
  } else if (streamsArray) {
    add(streamsArray)
  }

  return res
}

module.exports = multistream
module.exports.multistream = multistream
module.exports.default = multistream
