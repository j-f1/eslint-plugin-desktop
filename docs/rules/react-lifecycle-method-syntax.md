# Forbid erroneous usage of React lifecycle methods (react-lifecycle-method-syntax)

This rule was [originally created](https://github.com/desktop/desktop/blob/66f4984d186ac6202f84178decd6a44456f3b9cc/tslint-rules/reactProperLifecycleMethodsRule.ts) as a TSLint rule for the GitHub Desktop app.

## Rule Details

This rule aims to ensure that you don’t misspell the names of React lifecycle methods and that you use the correct parameter names (and types if you’re using TypeScript) for those methods.

Examples of **incorrect** code for this rule:

```ts

class MyComponent extends React.Component<MyProps, MyState> {
  componentWillMount(extraParameter) {}
  componentWillReceiveProps(props: string) {
    // parameter is `nextProps`, and it should be of type `MyProps`
  }
  componentWIllUnmout() {} // that’s a typo!
}

```

Examples of **correct** code for this rule:

```js

class MyComponent extends React.Component<MyProps, MyState> {
  componentWillMount() {}
  componentWillReceiveProps(nextProps: MyProps) {}
  componentWillUnmount() {}
}

```

## When Not To Use It

If you don’t use React, this rule won’t help you. If you’re using Flow, please help by adding support for Flow type annotations :smile:

## Further Reading

* [The original rule from desktop/desktop](https://github.com/desktop/desktop/blob/66f4984d186ac6202f84178decd6a44456f3b9cc/tslint-rules/reactProperLifecycleMethodsRule.ts)
