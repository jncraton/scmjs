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
        process.exit(1)
      }
    }
  }
}

expect('(display (+ 1 1)))').toBe(2)
expect('(display ((+ 2 2))').toBe(4)
expect('(display ((+ 2 (+ 1 2)))').toBe(5)
