/**
 * @fileoverview Ensure that methods passed to components are bound
 * @author Jed Fox
 */
'use strict'

const { findParent } = require('../util')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Ensure that methods passed to components are bound',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: 'code',
  },

  create: function(context) {
    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      JSXAttribute(node) {
        if (!node.value || node.value.type !== 'JSXExpressionContainer') return
        const expr = node.value.expression
        if (
          expr.type === 'MemberExpression' &&
          expr.object.type === 'ThisExpression'
        ) {
          let key = null
          if (expr.computed) {
            if (expr.property.type === 'Literal') {
              key = String(expr.property.value)
            }
          } else {
            key = expr.property.name
          }
          const classNode = findParent(node, 'ClassDeclaration ClassExpression')
          if (!key || !classNode) return

          const { superClass } = classNode
          if (
            superClass.type !== 'MemberExpression' ||
            superClass.object.name !== 'React' ||
            superClass.property.name !== 'Component' ||
            superClass.computed
          )
            return

          const method = classNode.body.body.find(method => {
            if (method.computed) {
              if (method.key.type === 'Literal') {
                return method.key.value === key
              }
            } else {
              return method.key.name === key
            }
          })
          if (!method) {
            context.report({
              node: node.value.expression.property,
              message: '`{{methodName}}` can’t be found on <{{class}} />.',
              data: {
                methodName: key,
                class: (classNode.id || {}).name || '[anonymous]',
              },
            })
            return
          }
          if (
            method.type !== 'ClassProperty' ||
            method.value.type !== 'ArrowFunctionExpression'
          ) {
            context.report({
              node: method,
              message:
                '{{methodName}} is not bound, but it was passed to <{{name}} /> in the `{{prop}}` prop at {{line}}:{{column}}.',
              data: {
                methodName: key,
                name: node.parent.name.name,
                prop: node.name.name,
                line: expr.property.loc.start.line,
                column: expr.property.loc.start.column,
              },
              fix:
                method.type !== 'ClassProperty' &&
                function*(fixer) {
                  yield fixer.insertTextBefore(method.value, ' = ')
                  yield fixer.insertTextBefore(method.value.body, '=> ')
                },
            })
          }
        }
      },
    }
  },
}
