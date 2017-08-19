exports.ts = (...tests) =>
  tests.map(test => {
    if (typeof test === 'string') {
      test = { code: test }
    }
    test.parser = 'typescript-eslint-parser'
    return test
  })

exports.handleInvalid = error => {
  const errors = [error]
  return (...tests) =>
    tests.map(test => {
      if (typeof test === 'string') {
        test = { code: test }
      }
      test.code = test.code.trim()
      if (!test.errors) {
        test.errors = JSON.parse(JSON.stringify(errors))
      }
      test.errors.forEach(err => {
        if (err.data || test.data) {
          const data = Object.assign(Object.create(null), err.data, test.data)
          // https://github.com/eslint/eslint/blob/d00e24f/lib/linter.js#L989-L995
          err.message = err.message.replace(
            /\{\{\s*([^{}]+?)\s*\}\}/g,
            (match, term) => {
              if (term in data) {
                return data[term]
              }
              return match
            }
          )
        }
      })
      return test
    })
}
