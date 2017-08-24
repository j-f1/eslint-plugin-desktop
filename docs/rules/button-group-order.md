# Enforce a consistent order for buttons inside of a `<ButtonGroup>` component (button-group-order)

This rule was originally created for the GitHub Desktop codebase’s internal use.

## Rule Details

This rule attempts to enforce a consistent order for <Button> elements
inside of a <ButtonGroup> component.
Example:

Examples of **incorrect** code for this rule:

```ts
<ButtonGroup>
  <Button>Cancel</Button>
  <Button type='submit'>Ok</Button>
</ButtonGroup>
```

The example above will trigger an error since we want to enforce
a consistent order of OK/Cancel-style buttons (the button captions vary)
such that the primary action precedes any secondary actions.
We've opted for using the Windows order of OK, Cancel in our codebase, the
actual order at runtime will vary depending on platform.


Examples of **correct** code for this rule:

```ts
<ButtonGroup>
  <Button type='submit'>Ok</Button>
  <Button>Cancel</Button>
</ButtonGroup>
```

### Options

There is an object option that configures the names of the `<Button>`
and `<ButtonGroup>` elements:

```json
{
  "desktop/button-group-order": [
    "error",
    {
      "button": "button",
      "buttonGroup": "ButtonGrouping"
    }
  ]
}
```


## When Not To Use It

If you do not want to enforce button order, or if you want to enforce a different button order, you should disable this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.

* [OK-Cancel or Cancel-OK? The Trouble With Buttons](https://www.nngroup.com/articles/ok-cancel-or-cancel-ok/) from [NN/g](https://www.nngroup.com)
