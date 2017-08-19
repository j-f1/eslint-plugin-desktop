/**
 * @fileoverview When a Promise is created with `new Promise`, the function provided must call `reject()` or `resolve()` in all branches. Tests created by Hamlet D'Arcy.
 * @author Jed Fox
 * @author Hamlet D'Arcy (@HamletDRC)
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/promise-must-complete')
const RuleTester = require('eslint').RuleTester
const handleInvalid = require('../../utils').handleInvalid({
  message:
    'A Promise was found that appears to not have resolve or reject invoked on all code paths',
  line: 1,
  column: 13,
})

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
  },
})

ruleTester.run('promise-must-complete', rule, {
  valid: [
    `new Promise((resolve, reject) => {
      if (something) {
        resolve('value');
      } else {
        if (somethingElse) {
          resolve('value');
        } else {
          reject();
        }
      }
    })`,
    `new Promise((resolve, reject) => {
      resolve('value');
    })`,
    `new Promise(function (resolve, reject) {
      resolve('value');
    })`,
    `new Promise((someOtherName, reject) => {
      someOtherName('value');
    })`,
    `new Promise((resolve, reject) => {
      reject('value');
    })`,
    `new Promise(function (resolve, reject) {
      reject('value');
    })`,
    `new Promise((resolve, someOtherName) => {
      someOtherName('value');
    })`,
    `new Promise((resolve, reject) => {
      if (something) {
        resolve('value');
      }
    })`,
    `new Promise((resolve, reject) => {
      if (something) {
        resolve('value');
      } else {
        resolve('value');
      }
    })`,
    `new Promise((resolve, reject) => {
      if (something) {
        if (somethingElse) {
          resolve('value');
        } else {
          reject();
        }
      } else {
        if (somethingElse) {
          resolve('value');
        } else {
          reject();
        }
      }
    })`,
    `new Promise((resolve, reject) => {
      if (something) {
        if (somethingElse) {
          resolve('value');
        } else {
          reject();
        }
      } else {
        if (somethingElse) {
          somethingElse();
        } else {
          reject();
        }
        reject(); // branches are not even analyzed when main thread resolves
      }
    })`,
    `new Promise((resolve, reject) => {
      someCall(function () {
        resolve('value');
      });
    })`,
    `new Promise((resolve, reject) => {
      someCall(() => {
        resolve();
      });
    })`,
    `new Promise((resolve, reject) => {
      someCall((someParm) => {
        resolve('value');
      });
    })`,
    `new Promise((resolve, reject) => {
      for(var x = 0; x < something.length; x++) {
        resolve('value');
      }
    })`,
    `new Promise((resolve, reject) => {
      for(var x in something) {
        resolve('value');
      }
    })`,
    `new Promise((resolve, reject) => {
      while (something) {
        resolve();
      }
    })`,
    `new Promise((resolve, reject) => {
      doSomething(resolve); // reference escapes and we assume it resolves
    })`,
    `new Promise((resolve, reject) => {
      doSomething(reject); // reference escapes and we assume it resolves
    })`,
    `new Promise((resolve, reject) => {
      someCall(function (arg1, reject) {
        resolve('value');
      });
    })`,
    `new Promise((resolve, reject) => {
      someCall(function (resolve, arg2) {
        reject();
      });
    })`,
    `new Promise((resolve, reject) => {
      someCall((arg1, reject) => {
        resolve('value');
      });
    })`,
    `new Promise((resolve, reject) => {
      someCall((resolve, arg2) => {
        reject();
      });
    })`,
  ],

  invalid: handleInvalid(
    'new Promise(() => {})',
    'new Promise(function () {})',
    'new Promise((resolve, reject) => {})',
    'new Promise((resolve, reject) => {})',
    `new Promise((resolve, reject) => {
      if (something) {
        someOtherFunction();
      }
    })`,
    `new Promise((resolve, reject) => {
      if (something) {
        resolve('value');
      } else {
        someOtherFunction()
      }
    })`,
    `new Promise((resolve, reject) => {
      if (something) {
        if (somethingElse) {
          resolve('value');
        } else {
          reject();
        }
      } else {
        if (somethingElse) {
          somethingElse();
        } else {
          reject();
        }
      }
    })`,
    `new Promise((resolve, reject) => {
      someCall(function (resolve) {  // this parameter actually shadows the one in the enclosing scope
        resolve();
      });
    })`,
    `new Promise((resolve, reject) => {
      someCall(function (reject) {  // this parameter actually shadows the one in the enclosing scope
        reject();
      });
    })`,
    `new Promise((resolve, reject) => {
      someCall((arg1, resolve) => { // this parameter actually shadows the one in the enclosing scope
        resolve('value');
      });
    })`,
    `new Promise((resolve, reject) => {
      someCall((reject) => {  // this parameter actually shadows the one in the enclosing scope
        reject();
      });
    })`
  ),
})
