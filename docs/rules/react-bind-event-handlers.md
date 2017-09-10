# Ensure that methods passed to components are bound (react-bind-event-handlers)

This rule came from discussion in [desktop/desktop#2371](https://github.com/desktop/desktop/issues/2371).

## Rule Details

This rule aims to ensure that all event handlers are bound to the component instance.

Examples of **incorrect** code for this rule:

```js

class Foo extends React.Component {
  render() {
    return <Bar onEvent={this.onEvent} />
  }
  onEvent() {
    console.log(this === undefined) // => true (!)
  }
}

```

Examples of **correct** code for this rule:

```js

class Foo extends React.Component {
  render() {
    return <Bar onEvent={this.onEvent} />
  }
  onEvent = () => {
    console.log(this instanceof Foo) // => true
  }
}

```

## When Not To Use It

If you’re binding your event handlers in `constructor`, you should disable this rule.
