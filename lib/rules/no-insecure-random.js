/**
 * @fileoverview Forbid insecure sources for random data
 * @author Jed Fox
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Forbid insecure sources for random data',
      category: 'Best Practices',
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node
        if (
          callee.type === 'MemberExpression' &&
          callee.object.name === 'Math' &&
          callee.property.name === 'random'
        ) {
          context.report({
            node: callee,
            message: 'Math.random() produces insecure random numbers',
          })
        }
      },
    }
  },
}
