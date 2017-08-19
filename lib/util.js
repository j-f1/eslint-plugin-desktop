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
