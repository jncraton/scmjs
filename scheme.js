const scheme = {}

scheme.eval = src => {
  const parse = (tokens, tree = []) => {
    let token = tokens.shift()

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
    newline: () => stdout += '\n',
    display: function (output) {
      output = ev(output, this)
      if (output === true) output = '#t'
      if (output === false) output = '#f'
      stdout += output
    },
    cond: function (...matches) {
      for (match of matches) {
        if (ev(match[0], this)) {
          return ev(match[1], this)
        }
      }
    },
    define: function (name, value) {
      const isProcedure = Array.isArray(name)

      if (!isProcedure) {
        this[name] = ev(value, this)
      } else {
        this[name[0]] = function (...args) {
          const frame = Object.create(this)
          name.slice(1).forEach((argName, i) => {
            frame[argName] = ev(args[i], this)
          })

          const result = ev(value, frame)
          return Array.isArray(result) ? result.at(-1) : result
        }
      }
    },
  }

  const ev = (ast, env = globalEnv) => {
    if (typeof ast == 'string') {
      return ast.match(/\d+/) ? +ast : (env[ast] ?? ast)
    } else if (typeof env[ast[0]] == 'function') {
      return env[ast[0]](...ast.slice(1).map(e => (env[ast[0]].prototype ? e : ev(e, env))))
    } else {
      return ast.map(e => ev(e, env))
    }
  }

  const tokens = [...src.matchAll(/(\-?\d+|[\(\)\+\-\*\\\=\<\>]|\w+)/gm)].map(s => s[0])
  const ast = parse(tokens)
  const result = ev(ast)

  return stdout
}
