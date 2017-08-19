/**
 * @fileoverview Custom rules used in the GitHub Desktop codebase
 * @author Jed Fox
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var requireIndex = require('requireindex')
const path = require('path')

// ------------------------------------------------------------------------------
// Plugin Definition
// ------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = requireIndex(path.join(__dirname, 'rules'))
