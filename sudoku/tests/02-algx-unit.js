'use strict';

const mocha = require('mocha');
const chai = require('chai');
const assert = chai.assert;

const algx = require('../algx.js');

suite('Algorithm X Unit Tests',
      function()
      {
        suiteSetup(
          function()
          {
          });
        
        suite('Algorithm X Functions',
              function()
              {
                test('function exactCoverMatrixToString(m)',
                     function()
                     {
                       assert.equal(algx.exactCoverMatrixToString(algx.testExactCoverMatrix()), '1  1  1\n1  1   \n   11 1\n  1 11 \n 11  11\n 1    1', 'The string representations of the matrices should be equal.');
                     });

                test('function solver() returns array',
                     function()
                     {
                       const solutionRows = algx.solver(algx.testExactCoverMatrix(), []);
                       
                       assert.isArray(solutionRows, 'The solution row object should be an array.');
                     });

                test('function solver() correct array length',
                     function()
                     {
                       const knownRows = [ 0, 1, 0, 1, 0, 1 ];
                       const solutionRows = algx.solver(algx.testExactCoverMatrix(), []);
                       
                       assert.equal(solutionRows.length, knownRows.length, 'The solution row arrays should have the same length.');
                     });

                test('function solver() correct solution',
                     function()
                     {
                       const knownRows = [ 0, 1, 0, 1, 0, 1 ];
                       const solutionRows = algx.solver(algx.testExactCoverMatrix(), []);
                       
                       assert.deepEqual(solutionRows, knownRows, 'The solution row arrays should be equal.');
                     });

                test('function solver() correct solution with debugging output',
                     function()
                     {
                       const knownRows = [ 0, 1, 0, 1, 0, 1 ];
                       const solutionRows = algx.solver(algx.testExactCoverMatrix(), [], true);
                       
                       assert.deepEqual(solutionRows, knownRows, 'The solution row arrays should be equal.');
                     });
              });

        suite('class CurrentSolution Methods',
              function()
              {
                test('method CurrentSolution.toString()',
                     function()
                     {
                       let cs = new algx.CurrentSolution(algx.testExactCoverMatrix());

                       assert.equal(cs.toString(), '1001001\n1001000\n0001101\n0010110\n0110011\n0100001', 'Exact cover matrix should equal string.');
                     });

                test('method CurrentSolution.toString(true):  partial, none covered',
                     function()
                     {
                       let cs = new algx.CurrentSolution(algx.testExactCoverMatrix());

                       assert.equal(cs.toString(true), '1001001\n1001000\n0001101\n0010110\n0110011\n0100001', 'Exact cover matrix should equal string.');
                     });

                test('method CurrentSolution.toString(true):  partial, row covered',
                     function()
                     {
                       let cs = new algx.CurrentSolution(algx.testExactCoverMatrix());
                       cs.cover(0);

                       assert.equal(cs.toString(true), '0111', 'Exact cover matrix should equal string.');
                     });
              });
      });
