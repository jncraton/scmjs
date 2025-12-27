const fs = require('node:fs')

const src = fs.readFileSync('scheme.js', 'utf-8')

eval(src + ';globalThis.scheme = scheme')
const e = globalThis.scheme.eval

function expect(src) {
  return {
    toBe: (val) => {
      const res = e(src)

      if (res != val) {
        console.error('Assertion failed', src, res, '!=', val)
      }
    }
  }
}

expect('(+ 1 1)').toBe(2)
