/**
 * @fileoverview Forbid erroneous usage of React lifecycle methods
 * @author Jed Fox
 */
'use strict'

const { traverse } = require('../util')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Forbid erroneous usage of React lifecycle methods',
      category: 'Possible errors',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      // fill in your schema
    ],
  },

  create: function(context) {
    const sourceCode = context.getSourceCode()

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Verify that the node does not take parameters
     * @param  {MethodDeclaration} node The node to check
     * @return {void}
     */
    function verifyEmptyParameters(node) {
      if (node.value.params.length) {
        context.report({
          node: node.key,
          message: '{{ name }} should not accept any parameters.',
          data: {
            name: node.key.name,
          },
        })
      }
    }

    /**
     * Verify that the parameter is of a specific type and name
     * @param  {Identifier} node         The parameter node
     * @param  {?string}    expectedName The expected name of the parameter
     * @param  {?string}    expectedType The expected type of the parameter
     * @return {boolean}                 Whether the requirements were satisfied
     */
    function verifyParameter(node, expectedName, expectedType) {
      const name = node.name || sourceCode.getText(node)
      let ok = true

      if (expectedName) {
        if (node.type !== 'Identifier' || expectedName !== node.name) {
          context.report({
            node,
            message:
              'The {{ name }} parameter should be named {{ expectedName }}.',
            data: {
              name,
              expectedName,
            },
          })
          ok = false
        }
      }

      if (expectedType) {
        if (
          !node.typeAnnotation ||
          sourceCode.getText(node.typeAnnotation.typeAnnotation) !==
            expectedType
        ) {
          context.report({
            node: node.typeAnnotation.typeAnnotation,
            message:
              'The {{ name }} parameter should have a type annotation of `{{ expectedType }}`',
            data: {
              name,
              expectedType,
            },
            fix(fixer) {
              return fixer.replaceText(
                node.typeAnnotation.typeAnnotation,
                expectedType
              )
            },
          })
          ok = false
        }
      }

      return ok
    }

    /** @typedef {{name: string, type: string}} Parameter */
    /**
     * Verify the parameters of a function declaration
     * @param  {MethodDeclaration} node               The node to check
     * @param  {Array<Parameter>}  expectedParameters The parameters to check against
     * @return {boolean}                              Were the parameters valid?
     */
    function verifyParameters(node, expectedParameters) {
      // It's okay to omit parameters
      for (let i = 0; i < node.value.params.length; i++) {
        const param = node.value.params[i]
        if (i >= expectedParameters.length) {
          context.report({
            node: param,
            message: 'Unknown parameter `{{ name }}`',
            data: {
              name: param.name || sourceCode.getText(param),
            },
          })
          return false
        }

        const expected = expectedParameters[i]
        if (!verifyParameter(param, expected.name, expected.type)) {
          return false
        }
      }

      for (let i = node.value.params.length - 1; i >= 0; i--) {
        const param = node.value.params[i]
        if (param.typeAnnotation) {
          if (param.typeAnnotation.typeAnnotation.type === 'TSVoidKeyword') {
            context.report({
              node: param,
              message: 'Unexpected void parameter `{{ name }}`',
              data: {
                name: param.name || sourceCode.getText(param),
              },
            })
            return false
          } else {
            break // Found a used param
          }
        }
      }

      return true
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'ClassDeclaration, ClassExpression'(node) {
        const { superClass, superTypeParameters } = node
        if (superClass) {
          if (
            superClass.type === 'MemberExpression' &&
            !superClass.computed &&
            superClass.object.type === 'Identifier' &&
            superClass.object.name === 'React' &&
            superClass.property.type === 'Identifier' &&
            superClass.property.name === 'Component'
          ) {
            let propsTypeName, stateTypeName
            if (superTypeParameters && superTypeParameters.params) {
              if (
                superTypeParameters.params[0] &&
                superTypeParameters.params[0].typeName.type === 'Identifier'
              ) {
                propsTypeName = superTypeParameters.params[0].typeName.name
              }
              if (
                superTypeParameters.params[1] &&
                superTypeParameters.params[1].typeName.type === 'Identifier'
              ) {
                stateTypeName = superTypeParameters.params[1].typeName.name
              }
            }

            const handleMethod = node => {
              if (
                !node.computed &&
                node.key.type === 'Identifier' &&
                /^(shouldC|c)omponent/.test(node.key.name)
              ) {
                switch (node.key.name) {
                  case 'componentWillMount':
                  case 'componentDidMount':
                  case 'componentWillUnmount':
                    return verifyEmptyParameters(node)
                  case 'componentWillReceiveProps':
                    return verifyParameters(node, [
                      { name: 'nextProps', type: propsTypeName },
                    ])
                  case 'componentWillUpdate':
                    return verifyParameters(node, [
                      { name: 'nextProps', type: propsTypeName },
                      { name: 'nextState', type: stateTypeName },
                    ])
                  case 'componentDidUpdate':
                    return verifyParameters(node, [
                      { name: 'prevProps', type: propsTypeName },
                      { name: 'prevState', type: stateTypeName },
                    ])
                  case 'shouldComponentUpdate':
                    return verifyParameters(node, [
                      { name: 'nextProps', type: propsTypeName },
                      { name: 'nextState', type: stateTypeName },
                    ])
                  default:
                    context.report({
                      node: node.key,
                      message:
                        'Method names starting with component or shouldComponent are prohibited since they can be confused with React lifecycle methods.',
                    })
                }
              }
            }

            traverse(node, {
              MethodDefinition: handleMethod,
              ClassProperty(node) {
                if (node.value.type.endsWith('FunctionExpression')) {
                  handleMethod(node)
                }
              },
            })
          }
        }
      },
    }
  },
}
