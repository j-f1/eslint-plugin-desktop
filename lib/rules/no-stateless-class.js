/**
 * @fileoverview Forbid classes without state
 * @author Jed Fox
 */
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Forbid classes without state',
      category: 'Best Practices',
      recommended: false,
    },
  },

  create(context) {
    const message =
      'The class {{ name }} is stateless. This indicates a failure in the object model.'

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Determines if the provided class is stateful
     * @param   {ClassDeclaration}  node The node to check
     * @returns {boolean}                Is the class stateful?
     */
    function classIsStateful(node) {
      if (node.superClass) {
        return true
      }
      if (node.body.body.length === 0) {
        return false
      }

      const hasConstructorProps = node.body.body.some(child => {
        if (child.kind !== 'constructor') return false
        if (
          child.value.params.find(param => param.type === 'TSParameterProperty')
        ) {
          return true
        }
        if (child.value.body && child.value.body.body) {
          // child.value.body is not present when the class is a `declare class` declaration
          return child.value.body.body.find(
            stmt =>
              stmt.type === 'ExpressionStatement' &&
              stmt.expression.type === 'AssignmentExpression' &&
              stmt.expression.left.type === 'ThisExpression'
          )
        }
      })

      if (hasConstructorProps) {
        return true
      }

      return !!node.body.body.find(
        child => child.kind !== 'constructor' && !child.static
      )
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'ClassDeclaration, ClassExpression'(node) {
        if (!classIsStateful(node)) {
          let name = '<unknown>'

          if (node.id) {
            name = node.id.name
          } else if (
            node.parent.type === 'VariableDeclarator' &&
            node.parent.id.type === 'Identifier'
          ) {
            name = node.parent.id.name
          }
          context.report({
            node,
            message,
            data: {
              name,
            },
          })
        }
      },
    }
  },
}
