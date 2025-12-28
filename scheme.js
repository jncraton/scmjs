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
    '+': (a, b) => a + b,
    '*': (a, b) => a * b,
    display: output => {
      stdout += output
    },
    define(name, value) {
      if (Array.isArray(name)) {
        // This is a procedure definition
        let argNames = name.slice(1)
        let impl = value
        name = name[0]

        callerFrame = this

        this[name] = function (...args) {
          const frame = Object.create(callerFrame)
          argNames.forEach((argName, i) => {
            frame[argName] = args[i]
          })

          return eval(impl, frame)
        }
      } else {
        this[name] = value
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

    if (ast[0] == 'define') {
      return env[ast[0]](...ast.slice(1).map(e => +e || e))
    } else if (typeof env[ast[0]] == 'function') {
      return env[ast[0]](...ast.slice(1).map(e => eval(e, env)))
    } else {
      return ast.map(e => eval(e, env))
    }
  }

  const tokens = [...src.matchAll(/([\(\)\+\-\*\\]|\d+|\w+)/gm)].map(s => s[0])
  const ast = parse(tokens)
  const result = eval(ast)

  return stdout
}
