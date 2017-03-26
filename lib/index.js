/**
 * @fileoverview Enforce angular components to have a strict interface definition on the top.
 * @author Felippe Nardi
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + "/rules");

module.exports.configs = {
  recommended: {
    plugins: ["angular-header-interface"],
    rules: {
      "angular-header-interface/name-return-after-class": "error"
    }
  }
};
