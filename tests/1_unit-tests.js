'use strict';

const chai = require('chai');
const assert = chai.assert;
const mocha = require('mocha');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

let Solver;

suite('UnitTests', function()
      {
        suiteSetup(function()
                   {
                     // Mock the DOM for testing and load Solver
                     return JSDOM.fromFile('./views/index.html')
                       .then(function(dom)
                             {
                               global.window = dom.window;
                               global.document = dom.window.document;

                               Solver = require('../public/sudoku-solver.js');
                             });
                   });
        
        // Only the digits 1-9 are accepted as valid input for the
        // puzzle grid.
        suite('Function validChars()', function()
              {
                // Valid characters or numbers are accepted as valid
                // input for the puzzle grid.
                test('Valid "1-9" characters', function(done)
                     {
                       const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
                       for (let i = 0; i < input.length; i++)
                       {
                         assert.isTrue(Solver.validChars(input[i]), 'These input characters should be valid.');
                       }

                       done();
                     });

                // Invalid characters or numbers are not accepted as
                // valid input for the puzzle grid.
                test('Invalid characters (anything other than "1-9") are not accepted', function(done)
                     {
                       const input = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];

                       for (let i = 0; i < input.length; i++)
                       {
                         assert.isFalse(Solver.validChars(input[i]), 'These input characters should be invalid.');
                       }

                       done();
                     });
              });
        
        suite('Function updateGrid()', function()
              {
                test('Parses a valid puzzle string into an object', function(done)
                     {
                       const input = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
                       const rowLabels = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];
                       const colLabels = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];

                       document.getElementById('text-input').value = input;
                       Solver.updateGrid();

                       for (let i = 0; i < 9; i++)
                       {
                         for (let j = 0; j < 9; j++)
                         {
                           let cell = rowLabels[i] + colLabels[j];
                           let cellValue = document.getElementById(cell).value;

                           if (input[i * 9 + j] === '.')
                           {
                             assert
                               .equal(cellValue,
                                      '',
                                      'Grid elements should match puzzle string characters.');
                           }
                           else
                           {
                             assert
                               .equal(cellValue,
                                      input[i * 9 + j],
                                      'Grid elements should match puzzle string characters.');
                           }
                         }
                       }

                       done();
                     });
                
                // Puzzles that are not 81 numbers/periods long show
                // the message "Error: Expected puzzle to be 81
                // characters long." in the `div` with the id
                // "error-msg".
                test('Shows an error for puzzles that are not 81 numbers long', function(done)
                     {
                       const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
                       const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
                       const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
                       const errorDiv = document.getElementById('error-msg');

                       document.getElementById('text-input').value = shortStr;
                       Solver.updateGrid();

                       assert.equal(errorDiv.firstElementChild.textContent, errorMsg, 'Short puzzle string error messages should match.');

                       document.getElementById('text-input').value = longStr;
                       Solver.updateGrid();

                       assert.equal(errorDiv.firstElementChild.textContent, errorMsg, 'Long puzzle string error messages should match.');
                       
                       done();
                     });
              });

        suite('Function validPuzzle()', function()
              {
                // Valid complete puzzles pass.
                test('Valid puzzles pass', function(done)
                     {
                       const puzzle = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

                       // document.getElementById('text-input').value = puzzle;
                       assert.isTrue(Solver.validPuzzle(puzzle), 'Puzzle should be valid.');

                       done();
                     });

                // Invalid complete puzzles fail.
                test('Invalid puzzles fail', done => {
                  const puzzle = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';

                  // document.getElementById('text-input').value = puzzle;
                  assert.isFalse(Solver.validPuzzle(puzzle), 'Puzzle should be invalid.');

                  done();
                });
              });
        
        
        suite('Function solve()', function()
              {
                // Returns the expected solution for a valid,
                // incomplete puzzle.
                test('Returns the expected solution for an incomplete puzzle', function(done)
                     {
                       const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
                       document.getElementById('text-input').value = input;
                       document.getElementById('solve-button').click();
                       let solution = document.getElementById('text-input').value;
                       let givenSolution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
                       assert.equal(solution, givenSolution, 'The solutions should be equal.');
                       done();
                     });
              });
      });
