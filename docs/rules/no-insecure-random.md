# Forbid insecure sources for random data (no-insecure-random)

This rule forbids using `Math.random()` to generate random data.

This rule does not forbid using `require('crypto').pseudoRandomBytes(...)` to generate random data because it is deprecated and aliased to `crypto.randomBytes` as of Node v4.

## Rule Details

This rule aims to prevent security issues caused by using insecure random data in your application.

Examples of **incorrect** code for this rule:

```js

Math.random()

```

Examples of **correct** code for this rule:

<!-- eslint-disable no-undef -->

```js

Math.min(a, b)

MyGlobal.random()

```

## When Not To Use It

If your application needs to run in an environment, such as older browsers, that do not have a method of retrieving secure random data, you should turn this rule off.
Additionally, if your application overrides the builtin `Math.random()` function to provide a secure result, you should turn this rule off.

## Further Reading

* [`insecure-random` from TSLint-Microsoft-contrib](https://github.com/Microsoft/tslint-microsoft-contrib/blob/b720cd9/src/insecureRandomRule.ts)
