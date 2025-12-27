const scheme = {}

scheme.eval = (src) => {
  const parse = (tokens, tree=[]) => {
    let token = tokens.shift()

    if (token == '(') {
      tree.push(parse(tokens))
      return tree
    } else if (token == ')') {
      return tree
    } else {
      tree.push(token)
      return parse(tokens, tree)
    }
  }

  const globalEnv = {
    '+': (a, b) => a + b,
  }

  const eval = (ast, env=globalEnv) => {
    if (typeof ast == 'string') {
      return +ast
    }

    if (Array.isArray(ast)) {
      if (env[ast[0]]) {
        // Found a valid name in the environment
        if (typeof env[ast[0]] == 'function') {
          return env[ast[0]](...ast.slice(1).map(e => eval(e, env)))
        }
      } else {
        return ast.map(e => eval(e, env))
      }
    }
  }

  const tokens = [...src.matchAll(/(\d+|[\(\)\+\-\*\\])/g)].map(s => s[0])
  const ast = parse(tokens)
  const result = eval(ast)

  return result
}
