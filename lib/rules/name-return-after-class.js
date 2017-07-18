/**
 * @fileoverview Rule to flag use of console object
 * @author Nicholas C. Zakas
 */

'use strict';

var _ = require('lodash');
var angularClassGlobal;
var angularClassKeys;

module.exports = {

    create: function(context) {
      var angularMainClasses = [
        'controller',
        'service',
        'factory',
        'component',
        'directive',
        'filter'
      ];

      return {

        MemberExpression: function(node) {
          var isAngularModuleMethod =
            _.get(node, 'object.callee.object.name') === 'angular';
          var angularClass = _.get(node, 'property.name');
          var isOneOfAngularMainClasses = angularMainClasses.indexOf(angularClass) > -1;
          var firstVariable = _.get(node, 'parent.arguments[1].body.body[0].declarations[0]')
          var firstVariableName = _.get(firstVariable, 'id.name');

          // Makes sure the first declared variable of angular class registering
          // is the same as the class used.
          if(isAngularModuleMethod &&
            isOneOfAngularMainClasses &&
            firstVariableName) {

            angularClassGlobal = angularClass;

            var alternativeClass;

            if (angularClass === 'factory') {
              alternativeClass = 'service';
            } else if (angularClass === 'controller') {
              alternativeClass = 'ctrl';
            }

            if (alternativeClass !== firstVariableName &&
              angularClass !== firstVariableName) {

              context.report(
                firstVariable,
                'Use "' +
                (alternativeClass || angularClass) +
                '" instead of "' +
                firstVariableName +
                '" for the first declared variable of this ' +
                _.upperFirst(angularClass) +
                '.'
              );
            }

            angularClassKeys =
              _.map(firstVariable.init.properties, function(property) {
                return property.key.name;
              })

              // var a = _.filter(_.get(node, 'parent.arguments[1].body.body'),
              //   {type: 'FunctionDeclaration'}
              // ).map(function(element) {
              //   console.log(_.get(element, 'body.body[0].id.name'));

              //   // use reduce

              //   return element.id.name;
              // });

              // console.log(a);

              // console.log(node);
              // console.log(
              //   objTraverse.findAll(a, 'object', { type: 'BlockStatement' })
              // );

            // var returnStatementPosition = _.indexOf(node.parent.body, node);
            // var elementsBeforeReturn =
            //   node.parent.body.slice(0,returnStatementPosition);
            // var elementsAfterReturn =
            //   node.parent.body.slice(returnStatementPosition + 1);

            // console.log(elementsAfterReturn);

          }

          // Require the interface to be returned
          if(isAngularModuleMethod &&
              isOneOfAngularMainClasses &&
              node.parent && node.parent.arguments[1] && node.parent.arguments[1].body &&
              node.parent.arguments[1].body.body) {
            var returnVariable = _.filter(_.get(node, 'parent.arguments[1].body.body'), function(element) {
              return element.type === 'ReturnStatement';
            }).map(function(element) {
              return element.argument.name;
            });

            if (returnVariable.length === 0) {
              context.report(
                node.property,
                'You must return an interface object inside the ' +
                _.upperFirst(angularClass) +
                ' function.'
              );
            }

          }

        },


        ReturnStatement: function(node) {
          var returnVariable = _.get(node, 'argument');
          var returnVariableName = _.get(returnVariable, 'name');
          var angularClass =
            _.get(node, 'parent.parent.parent.callee.property.name');
          var isTheInterfaceReturn = angularMainClasses.indexOf(angularClass) > -1;

          // Require returned interface variable to be named after the
          // main angular class used
          if (isTheInterfaceReturn) {

            var alternativeClass;

            if (angularClass === 'factory') {
              alternativeClass = 'service';
            } else if (angularClass === 'controller') {
              alternativeClass = 'ctrl';
            }

            if (alternativeClass !== returnVariableName &&
              angularClass !== returnVariableName) {
              context.report(
                returnVariable,
                'Return "' +
                (alternativeClass || angularClass) +
                '" instead of "' +
                returnVariableName +
                '".'
              );
            }


            var returnStatementPosition = _.indexOf(_.get(node, 'parent.body'), node);
            var elementsBeforeReturn =
              _.get(node, 'parent.body').slice(0,returnStatementPosition);
            var elementsAfterReturn =
              _.get(node, 'parent.body').slice(returnStatementPosition + 1);

            // No functions declaration can appear before interface object is
            // returned
            var functionDeclarationsBeforeReturn =
              _.filter(elementsBeforeReturn, function(element) {
                return element.type === 'FunctionDeclaration';
              }).filter(function(element) {
                return element;
              })

            _.map(functionDeclarationsBeforeReturn, function(element) {
              context.report(
                element,
                'Move function declaration below interface return statement.'
              );
            });

            // Only `activate()` may run before return statement
            var expressionStatementsBeforeReturn =
              _.filter(elementsBeforeReturn, function(element) {
                return element.type === 'ExpressionStatement';
              });

              _.map(expressionStatementsBeforeReturn, function(expression) {
                if(_.get(expression, 'expression.callee.name') !== 'activate') {
                  context.report(
                    expression,
                    'Only activate() can go before interface object is returned.'
                  );
                }
              });

              // Only function declarations allowed after interface is returned
              _.filter(elementsAfterReturn, function(element) {
                return element.type !== 'FunctionDeclaration';
              }).map(function(nonFunctionDeclaration) {
                context.report(
                  nonFunctionDeclaration,
                  'Only function declarations are allowed after returning interface object.'
                );
              });

          }

        },


        // Make sure all methods and values added to the class
        // was declared in the interface
        Identifier: function(node) {
          if (node.name === angularClassGlobal &&
              _.get(node, 'parent.property.name') &&
              node.name !== _.get(node, 'parent.property.name')
            ) {
            if(
              angularClassKeys.indexOf(_.get(node, 'parent.property.name')) < 0
            ) {
              context.report(_.get(node, 'parent.property'),
                '"' +
                _.get(node, 'parent.property.name') +
                '" should be declared in the interface object.'
              );
            };
          }
        }

      }
    }

};
