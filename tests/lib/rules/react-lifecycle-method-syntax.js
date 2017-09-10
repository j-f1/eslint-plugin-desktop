/**
 * @fileoverview Forbid erroneous usage of React lifecycle methods
 * @author Jed Fox
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/react-lifecycle-method-syntax')
const RuleTester = require('eslint').RuleTester

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
ruleTester.run('react-lifecycle-method-syntax', rule, {
  valid: [
    `
      class Foo extends React.Component<P, S> {
        componentWillMount() {}
        componentDidMount() {}
        componentWillUnmount() {}

        componentWillReceiveProps() {}

        componentWillUpdate() {}
        componentDidUpdate() {}

        shouldComponentUpdate()
      }
    `,
    `
      class Foo extends React.Component<P, S> {
        componentWillMount() {}
        componentDidMount() {}
        componentWillUnmount() {}

        componentWillReceiveProps(nextProps: P) {}

        componentWillUpdate(nextProps: P) {}
        componentDidUpdate(prevProps: P) {}

        shouldComponentUpdate(nextProps: P)
      }
    `,
    `
      class Foo extends React.Component<P, S> {
        componentWillMount() {}
        componentDidMount() {}
        componentWillUnmount() {}

        componentWillReceiveProps(nextProps: P) {}

        componentWillUpdate(nextProps: P, nextState: S) {}
        componentDidUpdate(prevProps: P, prevState: S) {}

        shouldComponentUpdate(nextProps: P, nextState: S)
      }
    `,
  ],

  invalid: [
    {
      code: `
        class Foo extends React.Component<P, S> {
          componentWillMount(foo: Bar) {}
        }
      `,
      output: null,
      errors: [
        {
          message: 'componentWillMount should not accept any parameters.',
          line: 3,
          column: 11,
        },
      ],
    },
    {
      code: `
        class Foo extends React.Component<P, S> {
          componentWillReceiveProps(nextProps: P, nextState: S) {}
        }
      `,
      output: null,
      errors: [
        {
          message: 'Unknown parameter `nextState`',
          line: 3,
          column: 51,
        },
      ],
    },
    {
      code: `
        class Foo extends React.Component<P, S> {
          componentWillReceiveProps(foo: Foo) {}
        }
      `,
      output: `
        class Foo extends React.Component<P, S> {
          componentWillReceiveProps(foo: P) {}
        }
      `,
      errors: [
        {
          message: 'The foo parameter should be named nextProps.',
          line: 3,
          column: 37,
        },
        {
          message: 'The foo parameter should have a type annotation of `P`',
          line: 3,
          column: 42,
        },
      ],
    },
  ],
})

/*
componentDidMount() {}
componentWillUnmount() {}

componentWillReceiveProps(nextProps: P) {}

componentWillUpdate(nextProps: P, nextState: S) {}
componentDidUpdate(prevProps: P, prevState: S) {}

shouldComponentUpdate(nextProps: P, nextState: S)
*/
