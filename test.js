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

// Basic addition
expect('(display (+ 1 1))').toBe(2)
expect('(display (+ 2 2))').toBe(4)

// Nested expressions
expect('(display (+ 2 (+ 1 2)))').toBe(5)
expect('(display (+ (+ 2 3) (+ 4 5)))').toBe(14)

// Multiple expressions
expect(`
(display (+ 1 1))
(display (+ 1 1))`).toBe(22)

// Define
expect(`
(define x 3)
(display x)
`).toBe(3)

expect(`
(define x 3)
(display (+ 2 (+ x 1)))
`).toBe(6)
