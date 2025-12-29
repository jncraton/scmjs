const scheme = {}

scheme.eval = src => {
  const lex = src => [...src.matchAll(/(\-?\d+|[\(\)\+\-\*\\\=\<\>]|\w+)/gm)].map(s => s[0])

  const parse = (tokens, tree = []) => {
    const token = tokens.shift()

    if (token == ')' || token === undefined) {
      return tree
    } else if (token == '(') {
      tree.push(parse(tokens))
      return tree.concat(parse(tokens))
    } else {
      tree.push(token)
      return parse(tokens, tree)
    }
  }

  let stdout = ''
  const globalEnv = {
    '+': (a, b) => a + b,
    '-': (a, b) => (b === undefined ? -a : a - b),
    '*': (a, b) => a * b,
    '=': (a, b) => a == b,
    '>': (a, b) => a > b,
    '<': (a, b) => a < b,
    newline: () => (stdout += '\n'),
    display: val => (stdout += { true: '#t', false: '#f' }[val] ?? val),
    cond: function (...matches) {
      for (match of matches) {
        if (this.eval(match[0])) {
          return this.eval(match[1])
        }
      }
    },
    define: function (name, value) {
      const isProcedure = Array.isArray(name)

      if (!isProcedure) {
        this[name] = this.eval(value)
      } else {
        this[name[0]] = function (...args) {
          const frame = Object.create(this)
          name.slice(1).forEach((arg, i) => (frame[arg] = this.eval(args[i])))

          const result = frame.eval(value)
          return Array.isArray(result) ? result.at(-1) : result
        }
      }
    },
    eval: function (ast) {
      if (typeof ast == 'string') {
        return ast.match(/\d+/) ? +ast : (this[ast] ?? ast)
      } else if (typeof this[ast[0]] == 'function') {
        return this[ast[0]](...ast.slice(1).map(e => (this[ast[0]].prototype ? e : this.eval(e))))
      } else {
        return ast.map(e => this.eval(e))
      }
    }
  }

  globalEnv.eval(parse(lex(src)))
  return stdout
}
