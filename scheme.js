const scheme = {}

scheme.eval = (src) => {
  const tokens = [...src.matchAll(/(\d+|[\(\)\+\-\*\\])/g)].map(s => s[0])

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

  const ast = parse(tokens)
}
