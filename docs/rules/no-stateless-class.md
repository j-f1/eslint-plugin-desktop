# Forbid classes without state (no-stateless-class)

> A stateless class represents a failure in the object oriented design of the system. A class without state is better modeled as a module or given some state. A stateless class is defined as a class with only static members and no parent class.
<sup>[source](https://github.com/Microsoft/tslint-microsoft-contrib#readme)</sup>

## Rule Details

This rule aims to prevent the creation of stateless classes

Examples of **incorrect** code for this rule:

```ts

class Foo {}

class Bar {
  static baz() {}
}

```

Examples of **correct** code for this rule:

```ts

class Foo extends SuperClass {}

class Bar {
  baz() {}
}

```

## When Not To Use It

If you need to create empty classes, you should turn off this rule.

## Further Reading

- [`no-stateless-class` in TSLint-Microsoft-contrib](https://github.com/Microsoft/tslint-microsoft-contrib/blob/d891ff9270fc2809bb2e8425b9a9a722e10bbe82/src/noStatelessClassRule.ts)
