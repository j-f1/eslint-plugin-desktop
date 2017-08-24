const estraverse = require('estraverse')

exports.flatten = (rules, isRoot = true) => {
  // { plugin: { rule: e } } -> { 'plugin/rule': e }
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
  estraverse.traverse(ast, {
    enter(node) {
      if (typeof handler[node.type] === 'function') {
        handler[node.type].call(this, node)
      }
    },
    exit(node) {
      const key = `${node.type}:exit`

      if (typeof handler[key] === 'function') {
        handler[key].call(this, node)
      }
    },
  })
}
