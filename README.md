# eslint-plugin-desktop

[![ISC License](https://img.shields.io/github/license/j-f1/eslint-plugin-desktop.svg?style=flat-square)](./license.md)
[![contributor count](https://img.shields.io/github/contributors/j-f1/eslint-plugin-desktop.svg?style=flat-square)](./graphs/contributors)
![npm](https://img.shields.io/badge/npm-j--f1/eslint--plugin--desktop-lightgray.svg?style=flat-square)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![Travis](https://img.shields.io/travis/j-f1/eslint-plugin-desktop.svg?style=flat-square)](https://travis-ci.org/j-f1/eslint-plugin-desktop)
[![Greenkeeper badge](https://badges.greenkeeper.io/j-f1/eslint-plugin-desktop.svg?style=flat-square)](https://greenkeeper.io/)

Custom rules (soon to be) used in the GitHub Desktop codebase

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-desktop`:

```
$ npm install eslint-plugin-desktop --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-desktop` globally.

## Usage

Add `desktop` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "desktop"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "desktop/rule-name": 2
    }
}
```

`eslint-plugin-desktop` also includes an ESLint config for use with your application:

```json
{
  "extends": [
    "plugin:desktop/recommended"
  ]
}
```

## Supported Rules

<!-- Please run `npm run docs` to update this section -->
<!-- begin rule list -->
* [`desktop/button-group-order`](./docs/rules/button-group-order.md) — Enforce a consistent order for buttons inside of a `<ButtonGroup>` component
* [`desktop/no-insecure-random`](./docs/rules/no-insecure-random.md) — Forbid insecure sources for random data
* [`desktop/no-stateless-class`](./docs/rules/no-stateless-class.md) — Forbid classes without state
* [`desktop/promise-must-complete`](./docs/rules/promise-must-complete.md) — When a Promise is created with `new Promise`, the function provided must call `reject()` or `resolve()` in all branches.
* [`desktop/react-bind-event-handlers`](./docs/rules/react-bind-event-handlers.md) — Ensure that methods passed to components are bound
* [`desktop/react-lifecycle-method-syntax`](./docs/rules/react-lifecycle-method-syntax.md) — Forbid erroneous usage of React lifecycle methods
<!-- end rule list -->
