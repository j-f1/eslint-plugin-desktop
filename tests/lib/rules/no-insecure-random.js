/**
 * @fileoverview Forbid insecure sources for random data
 * @author Jed Fox
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-insecure-random')
var RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester()
ruleTester.run('no-insecure-random', rule, {
  valid: ['Math.min(a, b)', 'MyGlobal.random()'],

  invalid: [
    {
      code: 'Math.random()',
      errors: [
        {
          message: 'Math.random() produces insecure random numbers',
          line: 1,
          column: 1,
        },
      ],
    },
  ],
})
