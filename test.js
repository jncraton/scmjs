const fs = require('node:fs')

const src = fs.readFileSync('scheme.js', 'utf-8')

eval(src + ';globalThis.scheme = scheme')
const e = globalThis.scheme.eval

function expect(src) {
  return {
    toBe: val => {
      const res = e(src)

      if (res != val) {
        console.error('Assertion failed', src, res, '!=', val)
        process.exit(1)
      }
    },
  }
}

// Basic addition
expect('(display (+ 1 1))').toBe(2)
expect('(display (+ 2 2))').toBe(4)

// Subtraction
expect('(display (- 2 1))').toBe(1)
expect('(display (- 2 2))').toBe(0)

// Multiplication
expect('(display (* 1 1))').toBe(1)
expect('(display (* 4 5))').toBe(20)

// Negative numbers
expect('(display (-1))').toBe(-1)
expect('(display (+ -2 1))').toBe(-1)

// Unary negation
expect('(display (- 1))').toBe(-1)
expect('(display (- (+ 1 1)))').toBe(-2)

// Nested expressions
expect('(display (+ 2 (+ 1 2)))').toBe(5)
expect('(display (+ (+ 2 3) (+ 4 5)))').toBe(14)
expect('(display (* (+ 2 3) (+ 4 5)))').toBe(45)

// Equality
expect('(display (= 1 1))').toBe('#t')
expect('(display (= 1 2))').toBe('#f')

// Greater than and less than
expect('(display (< 1 1))').toBe('#f')
expect('(display (> 1 1))').toBe('#f')
expect('(display (< 1 2))').toBe('#t')
expect('(display (> 1 2))').toBe('#f')
expect('(display (< 2 1))').toBe('#f')
expect('(display (> 2 1))').toBe('#t')

// Multiple expressions
expect(`
(display (+ 1 1))
(display (+ 1 1))`).toBe(22)

// Newlines
expect(`
(display (+ 1 1))
(newline)
(display (+ 1 1))`).toBe('2\n2')

// Define
expect(`
(define x 3)
(display x)
`).toBe(3)

expect(`
(define x 3)
(display (+ 2 (+ x 1)))
`).toBe(6)

// Functions
expect(`
(define (double x)
  (+ x x))

(display (double 3))
`).toBe(6)

expect(`
(define (double x)
  (+ x x))

(define (square x)
  (* x x))

(display (square (double 5)))
`).toBe(100)

expect(`
(define (quadruple x)
  ((define (double x)
    (+ x x))
  (double (double x))))

(display (quadruple 5))
`).toBe(20)

// Confirm that `double` only within `quadruple`
expect(`
((define (double x)
  (x)))

(define (quadruple x)
  ((define (double x)
    (+ x x))
  (double (double x))))

(display (double 5))
`).toBe(5)

// cond
expect(`
(define (abs x)
  (cond ((> x 0) x)
        ((= x 0) 0)
        ((< x 0) (- x))))

(display (abs -3))
(newline)
(display (abs 3))
(newline)
(display (abs 0))
`).toBe('3\n3\n0')
