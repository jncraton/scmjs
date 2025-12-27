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

    return ast.map(expr => {
      if (Array.isArray(expr)) {
        if (env[expr[0]]) {
          // Found a valid name in the environment
          if (typeof env[expr[0]] == 'function') {
            return env[expr[0]](...expr.slice(1).map(e => eval(e, env)))
          }
        } else {
          return eval(expr, env)
        }
        return eval(expr, Object.create(ast))
      }
    })
  }

  const tokens = [...src.matchAll(/(\d+|[\(\)\+\-\*\\])/g)].map(s => s[0])
  const ast = parse(tokens)
  const result = eval(ast)

  return result
}
