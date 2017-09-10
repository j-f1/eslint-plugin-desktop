const ESDispatcher = require('esdispatch')

exports.flatten = (rules, isRoot = true) => {
  // { plugin: { rule: e, no: { 'bad-thing': e } } } -> { 'plugin/rule': e, 'plugin/no-bad-thing': e }
  const flat = {}
  Object.keys(rules).forEach(name => {
    const value = rules[name]
    if (Array.isArray(value) || typeof value !== 'object') {
      flat[name] = value
    } else {
      if (name === 'no') {
        Object.keys(value).forEach(ruleName => {
          flat[`no-${ruleName}`] = value[ruleName]
        })
      } else if (isRoot) {
        // plugin name
        Object.keys(value).forEach(ruleName => {
          flat[`${name}/${ruleName}`] = exports.flatten(value[ruleName], false)
        })
      } else {
        flat[name] = value
      }
    }
  })
  return flat
}

/**
 * Traverse a node like ESLint lets you do
 * @param   {Node}   ast     The node to traverse
 * @param   {Object} handler The object to query for handlers
 * @returns {void}
 */
exports.traverse = (ast, handler) => {
  const dispatcher = new ESDispatcher()
  Object.keys(handler).forEach(selector => {
    let listener = handler[selector]
    if (selector.endsWith(':exit')) {
      selector = selector.replace(/:exit$/, '')
      listener = { leave: listener }
    }
    dispatcher.on(selector, listener)
  })
  dispatcher.observe(ast)
}
