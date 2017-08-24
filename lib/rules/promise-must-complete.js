/**
 * @fileoverview When a Promise is created with `new Promise`, the function provided must call `reject()` or `resolve()` in all branches.
 * @author Jed Fox
 */
'use strict'

const { traverse } = require('../util')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description:
        'When a Promise is created with `new Promise`, the function provided must call `reject()` or `resolve()` in all branches.',
      category: 'Possible Errors',
      recommended: true,
    },
  },

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Check if the expression is a valid Promise instantiation
     * @param   {NewExpression}  node The node to check
     * @returns {boolean}        Whether the node is a valid Promise instantiation
     */
    function isPromiseDeclaration(node) {
      if (
        node.callee.type === 'Identifier' &&
        node.callee.name === 'Promise' &&
        node.arguments.length > 0
      ) {
        const firstArg = node.arguments[0]

        return (
          firstArg.type === 'ArrowFunctionExpression' ||
          firstArg.type === 'FunctionExpression'
        )
      }
      return false
    }

    /**
     * Get the names of the `resolve` and `reject` parameters
     * @param  {FunctionExpression|ArrowFunctionExpression} node The node to analyze
     * @returns {Array<Identifier>}      The parameter names
     */
    function getCompletionIdentifiers(node) {
      const result = []
      const arg1 = node.params[0]
      const arg2 = node.params[1]

      if (arg1 && arg1.type === 'Identifier') {
        result.push(arg1.name)
      }
      if (arg2 && arg2.type === 'Identifier') {
        result.push(arg2.name)
      }

      return result
    }

    /**
     * Validate `new Promise` usage
     * @param  {Node}          block       The node to traverse to verify identifier usage
     * @param  {Array<string>} identifiers The identifiers to require the use of
     * @returns {boolean} Is the usage valid?
     */
    function validatePromiseUsage(block, identifiers) {
      let completed = false
      let hasBranches = false
      let allBranchesCompleted = true

      // eslint-disable-next-line require-jsdoc
      function isCompletionIdentifier(node) {
        if (node.type === 'Identifier' && identifiers.includes(node.name)) {
          return true
        }
        return false
      }

      // eslint-disable-next-line require-jsdoc
      function getNonShadowedCompletionIdentifiers(node) {
        const result = []

        identifiers.forEach(id => {
          const shadowed = node.params.find(
            param => param.type === 'Identifier' && param.name === id
          )

          if (!shadowed) {
            result.push(id)
          }
        })
        return result
      }

      // eslint-disable-next-line require-jsdoc
      function handleFunction(node) {
        const nonShadowedIdentifiers = getNonShadowedCompletionIdentifiers(node)

        this.skip() // eslint-disable-line no-invalid-this
        if (validatePromiseUsage(node.body, nonShadowedIdentifiers)) {
          completed = true
        }
      }

      traverse(block, {
        IfStatement(node) {
          this.skip()
          hasBranches = true
          if (!validatePromiseUsage(node.consequent, identifiers)) {
            allBranchesCompleted = false
          } else if (
            node.alternate &&
            !validatePromiseUsage(node.alternate, identifiers)
          ) {
            allBranchesCompleted = false
          }
          if (allBranchesCompleted) {
            this.break()
          }
        },

        CallExpression(node) {
          if (
            isCompletionIdentifier(node.callee) ||
            node.arguments.find(isCompletionIdentifier)
          ) {
            completed = true
            this.break()
          }
        },

        ArrowFunctionExpression: handleFunction,
        FunctionExpression: handleFunction,
      })
      if (completed) {
        return true // if the main code path completed then it doesn't matter what the child branches did
      }
      if (!hasBranches) {
        return false // if there were no branches and it is not complete... then it is in total not complete.
      }
      return allBranchesCompleted // if main path did *not* complete, the look at child branch status
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      NewExpression(node) {
        if (isPromiseDeclaration(node)) {
          const func = node.arguments[0]
          const completionIdentifiers = getCompletionIdentifiers(func)

          if (!validatePromiseUsage(func.body, completionIdentifiers)) {
            context.report({
              node: func,
              message:
                'A Promise was found that appears to not have resolve or reject invoked on all code paths',
            })
          }
        }
      },
    }
  },
}
