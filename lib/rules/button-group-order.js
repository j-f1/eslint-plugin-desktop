/**
 * @fileoverview Enforce a consistent order for buttons inside of a `<ButtonGroup>` component
 * @author Jed Fox
 */
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description:
        'Enforce a consistent order for buttons inside of a `<ButtonGroup>` component',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        properties: {
          button: {
            type: 'string',
          },
          buttonGroup: {
            type: 'string',
          },
        },
        additionalProperties: false,
        type: 'object',
      },
    ],
  },

  create: function(context) {
    const {
      button: Button = 'Button',
      buttonGroup: ButtonGroup = 'ButtonGroup',
    } =
      context.options[0] || {}

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      JSXElement(node) {
        if (node.openingElement.name.name !== ButtonGroup) {
          return
        }

        const buttons = node.children
          .map(child => {
            // return nothing if the child is not a button
            if (child.type === 'Literal' && child.value.match(/^\s*$/)) {
              return
            } else if (child.type === 'JSXElement') {
              if (child.openingElement.name.name === Button) {
                return child.openingElement
              }
            }

            context.report({
              node: child,
              message:
                '{{ ButtonGroup }}s should only contain <{{ Button }}> elements.',
              data: { ButtonGroup, Button },
            })
          })
          .filter(x => x)

        if (buttons.length >= 2) {
          const buttonsWithTypeAttr = buttons.map(button => {
            const typeAttr = button.attributes.find(
              attr => attr.name.name === 'type'
            )

            let value
            if (typeAttr) {
              const { value: typeValue } = typeAttr
              if (typeValue.type === 'JSXExpressionContainer') {
                // <Button type={'foo'} />
                if (typeValue.expression.type === 'Literal') {
                  value = typeValue.expression.value
                }
              } else if (typeValue.type === 'Literal') {
                value = typeValue.value
              }
            }
            return [button, value]
          })
          const primaryButtonIdx = buttonsWithTypeAttr.findIndex(
            ([_, type]) => type === 'submit'
          )

          if (primaryButtonIdx > 0) {
            context.report({
              node: buttons[primaryButtonIdx],
              message:
                '{{ ButtonGroup }}s should have the primary <{{ Button }}> as its first child.',
              data: { ButtonGroup, Button },
            })
          }
        }
      },
    }
  },
}
