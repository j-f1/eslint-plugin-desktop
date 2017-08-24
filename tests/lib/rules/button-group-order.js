/**
 * @fileoverview Enforce a consistent order for buttons inside of a `&lt;ButtonGroup&gt;` component
 * @author Jed Fox
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/button-group-order')
const RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const childMessage = 'ButtonGroups should only contain <Button> elements.'
const orderMessage =
  'ButtonGroups should have the primary <Button> as its first child.'

var ruleTester = new RuleTester({
  parser: 'typescript-eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
})
ruleTester.run('button-group-order', rule, {
  valid: [
    `
    <ButtonGroup>
      <Button type='submit'>Ok</Button>
      <Button>Cancel</Button>
    </ButtonGroup>
    `,
  ],

  invalid: [
    {
      code: `
      <ButtonGroup>
        <Button>Cancel</Button>
        <Button type='submit'>Ok</Button>
      </ButtonGroup>
      `,
      errors: [
        {
          message: orderMessage,
          line: 4,
          column: 9,
        },
      ],
    },
    {
      code: `
      <ButtonGroup>
        <div>Cancel</div>
      </ButtonGroup>
      `,
      errors: [
        {
          message: childMessage,
          line: 3,
          column: 9,
        },
      ],
    },
  ],
})
