/**
 * @fileoverview Ensure that methods passed to components are bound
 * @author Jed Fox
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/react-bind-event-handlers')
var RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({
  parser: 'typescript-eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
})
ruleTester.run('react-bind-event-handlers', rule, {
  valid: [
    `
      class Foo extends React.Component {
        render() {
          return <Bar onEvent={this.onEvent} />
        }
        onNotPassedToAComponent() {}
        onEvent = () => {}
      }
      `,
  ],

  invalid: [
    {
      code: `
        class Foo extends React.Component {
          render() {
            return <Bar onEvent={this.onEvent} onOtherEvent={this.onOtherEvent} />
          }
          onEvent() {}
          onOtherEvent = function () {}
        }
      `,
      output: `
        class Foo extends React.Component {
          render() {
            return <Bar onEvent={this.onEvent} onOtherEvent={this.onOtherEvent} />
          }
          onEvent = () => {}
          onOtherEvent = function () {}
        }
      `, // TODO: transform onOtherEvent to an arrow function
      errors: [
        {
          message:
            'onEvent is not bound, but it was passed to <Bar /> in the `onEvent` prop at 4:38.',
          line: 6,
          column: 11,
        },
        {
          message:
            'onOtherEvent is not bound, but it was passed to <Bar /> in the `onOtherEvent` prop at 4:66.',
          line: 7,
          column: 11,
        },
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          render() {
            return <Bar onEvent={this.onEvent} />
          }
        }
      `,
      errors: [
        {
          message: '`onEvent` can’t be found on <Foo />.',
          line: 4,
          column: 39,
        },
      ],
    },
  ],
})
