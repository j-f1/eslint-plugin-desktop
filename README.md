# eslint-plugin-desktop

[![Greenkeeper badge](https://badges.greenkeeper.io/j-f1/eslint-plugin-desktop.svg)](https://greenkeeper.io/)

[![Travis](https://img.shields.io/travis/j-f1/eslint-plugin-desktop.svg)](https://travis-ci.org/j-f1/eslint-plugin-desktop)

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

* [`no-insecure-random`](./docs/rules/no-insecure-random.md) — Forbid insecure sources for random data
* [`no-stateless-class`](./docs/rules/no-stateless-class.md) — Forbid classes without state
* [`promise-must-complete`](./docs/rules/promise-must-complete.md)  — When a Promise is created with `new Promise`, the function provided must call `reject()` or `resolve()` in all branches
