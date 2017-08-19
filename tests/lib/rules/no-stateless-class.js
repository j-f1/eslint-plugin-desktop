/**
* @fileoverview Forbid classes without state
* @author Jed Fox
* @author Hamlet D'Arcy (@HamletDRC)
*/
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-stateless-class')
const RuleTester = require('eslint').RuleTester
const handleInvalid = require('../../utils').handleInvalid({
  message:
    'The class {{ name }} is stateless. This indicates a failure in the object model.',
  line: 1,
  column: 1,
  data: {
    name: 'MyClass',
  },
})
const { ts } = require('../../utils')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
  },
})

ruleTester.run('no-stateless-class', rule, {
  valid: [
    `class ClassWithParent extends MyOtherClass {}
    `,
    `
    class ClassWithMethod {
      someMethod() {}
    }
    `,
    `
    class ClassWithStatefulConstructor {
      someMethod() {
        this.foo = 'bar'
      }
    }
    `,
  ].concat(
    ts(
      // classes with instance fields or methods have state
      `
      class ClassWithPrivateField {
        private field
      }
      `,
      `
      class ClassWithPrivateMethod {
        private someMethod() {}
      }
      `,
      `
      class ClassWithField {
        field = 'field'
      }
      `,
      // classes that extend others have state from parent
      `
      class ClassWithParentAndInterface extends MyOtherClass implements MyInterface {}
      `,
      `
      class ClassWithParentAndInterface extends MyOtherClass {}
      `,
      // broken due to parser bug https://github.com/eslint/typescript-eslint-parser/pull/363
      // `
      // class ClassWithParentAndInterface implements MyInterface extends MyOtherClass {}
      // `,
      `class Point {
        constructor(public x: number, public y: number) {}
      }
      `,
      `class Point {
        constructor(protected x: number, protected y: number) {}
      }
      `,
      `class Point {
        constructor(private x: number, private y: number) {}
      }
      `,
      `class Point {
        constructor(readonly x: number, readonly y: number) {}
      }
      `
    )
  ),

  invalid: handleInvalid(
    ...ts(
      `
      class MyClass {}
      `,
      `
      class MyClass {
        constructor() {}
      }
      `,
      `
      class MyClass implements MyInterface {
      }
      `,
      `
      class MyClass {
        private static field;
      }
      `,
      `
      class MyClass {
        private static myMethod() {}
      }
      `
    )
  ),
})
