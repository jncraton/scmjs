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
        exit(1)
      }
    }
  }
}

expect('(+ 1 1)').toBe(2)
expect('(+ 2 2)').toBe(4)
