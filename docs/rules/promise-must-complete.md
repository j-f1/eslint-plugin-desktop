# When a Promise is created with `new Promise`, the function provided must call `reject()` or `resolve()` in all branches. (promise-must-complete)

This rule [came from Microsoft’s TSLint contrib](https://github.com/Microsoft/tslint-microsoft-contrib/blob/b720cd9827a13c2878d304193544a5b030953ecb/src/promiseMustCompleteRule.ts).

## Rule Details

This rule aims to ensure that promises are resolved or rejected in all cases.

Examples of **incorrect** code for this rule:

<!-- eslint-disable no-new, no-undef -->

```js

new Promise((resolve, reject) => {
  if (itWorked()) {
    resolve(someResult)
  }
})

```

Examples of **correct** code for this rule:

<!-- eslint-disable no-new, no-undef -->

```js

new Promise((resolve, reject) => {
  if (itWorked()) {
    resolve(someResult)
  } else {
    reject(someError)
  }
})

```

## When Not To Use It

If you are not using ES6 code or Promies, you should disable this rule.
Additionally, if you have a global `Promise` object in your code that is unrelated to the standard `Promise`, you should disable this rule because it could cause errors when it shouldn’t.

## Further Reading

- [the rule in Microsoft’s TSLint contrib](https://github.com/Microsoft/tslint-microsoft-contrib/blob/b720cd9827a13c2878d304193544a5b030953ecb/src/promiseMustCompleteRule.ts)
