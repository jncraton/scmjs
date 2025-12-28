const scheme = {}

scheme.eval = src => {
  const parse = (tokens, tree = []) => {
    if (tokens.length == 0) {
      return tree
    }

    let token = tokens.shift()

    if (token == '(') {
      tree.push(parse(tokens))
      return tree.concat(parse(tokens))
    } else if (token == ')') {
      return tree
    } else {
      tree.push(token)
      return parse(tokens, tree)
    }
  }

  let stdout = ''
  const globalEnv = {
    ['+'](a, b) {
      return eval(a, this) + eval(b, this)
    },
    ['-'](a, b) {
      return b === undefined ? -eval(a, this) : eval(a, this) - eval(b, this)
    },
    ['*'](a, b) {
      return eval(a, this) * eval(b, this)
    },
    ['='](a, b) {
      return eval(a, this) == eval(b, this)
    },
    ['>'](a, b) {
      return eval(a, this) > eval(b, this)
    },
    ['<'](a, b) {
      return eval(a, this) < eval(b, this)
    },
    newline() {
      stdout += '\n'
    },
    display(output) {
      output = eval(output, this)
      if (output === true) output = '#t'
      if (output === false) output = '#f'
      stdout += output
    },
    cond(...matches) {
      for (match of matches) {
        if (eval(match[0], this)) {
          return eval(match[1], this)
        }
      }
    },
    define(name, value) {
      const isProcedure = Array.isArray(name)

      if (!isProcedure) {
        this[name] = eval(value, this)
      } else {
        this[name[0]] = (...args) => {
          args = args.map(a => eval(a, this))

          const frame = Object.create(this)
          name.slice(1).forEach((argName, i) => {
            frame[argName] = args[i]
          })

          const result = eval(value, frame)
          return Array.isArray(result) ? result.at(-1) : result
        }
      }
    },
  }

  const eval = (ast, env = globalEnv) => {
    if (typeof ast == 'string') {
      if (env[ast] !== undefined) {
        return env[ast]
      }
      return ast.match(/\d+/) ? +ast : ast
    }

    if (typeof env[ast[0]] == 'function') {
      return env[ast[0]](...ast.slice(1))
    } else {
      return ast.map(e => eval(e, env))
    }
  }

  const tokens = [...src.matchAll(/(\-?\d+|[\(\)\+\-\*\\\=\<\>]|\w+)/gm)].map(s => s[0])
  const ast = parse(tokens)
  const result = eval(ast)

  return stdout
}
