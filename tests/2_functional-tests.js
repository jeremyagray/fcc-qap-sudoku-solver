const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let Solver;

suite('Functional Tests', function()
      {
        suiteSetup(function()
                   {
                     // DOM already mocked -- load sudoku solver then run tests
                     Solver = require('../public/sudoku-solver.js');
                   });
        
        suite('Text area and sudoku grid update automatically', function()
              {
                // Entering a valid number in the text area populates 
                // the correct cell in the sudoku grid with that number
                test('Valid number in text area populates correct cell in grid', function(done)
                     {
                       const input = '12345';
                       const rowLabels = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];
                       const colLabels = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];

                       document.getElementById('text-input').value = input;
                       Solver.updateGrid();

                       rows:
                       for (let i = 0; i < 9; i++)
                       {
                         cols:
                         for (let j = 0; j < 9; j++)
                         {
                           if ((i * 9 + j) == input.length) break rows;
                           let cell = rowLabels[i] + colLabels[j];
                           let cellValue = document.getElementById(cell).value;

                           assert
                             .equal(cellValue,
                                    input[i * 9 + j],
                                    'Input characters and grid elements should be equal.');
                         }
                       }
                       
                       done();
                     });

                // Entering a valid number in the grid automatically updates
                // the puzzle string in the text area
                test('Valid number in grid updates the puzzle string in the text area', function(done)
                     {
                       const input = '3';
                       const expected = '....3............................................................................';

                       document.getElementById('clear-button').click();
                       document.getElementById('A5').value = input;
                       Solver.updateString();
                       const output = document.getElementById('text-input').value;

                       assert.equal(output, expected, 'Grid should update text area correctly.');

                       done();
                     });
              });
        
        suite('Clear and solve buttons', function()
              {
                // Pressing the "Clear" button clears the sudoku 
                // grid and the text area
                test('Function clearAll()', function(done)
                     {
                       const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
                       const rowLabels = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];
                       const colLabels = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];

                       document.getElementById('text-input').value = input;
                       Solver.updateGrid();
                       document.getElementById('clear-button').click();

                       assert.equal(document.getElementById('text-input').value, '', 'Text input area should be empty.');

                       for (let i = 0; i < 9; i++)
                       {
                         for (let j = 0; j < 9; j++)
                         {
                           let cell = rowLabels[i] + colLabels[j];
                           let cellValue = document.getElementById(cell).value;

                           assert
                             .equal(cellValue,
                                    '',
                                    'Grid elements should be empty.');
                         }
                       }

                       done();
                     });
                
                // Pressing the "Solve" button solves the puzzle and
                // fills in the grid with the solution
                test('Function solve()', function(done)
                     {
                       const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
                       const givenSolution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
                       const rowLabels = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];
                       const colLabels = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];

                       document.getElementById('text-input').value = input;
                       document.getElementById('solve-button').click();
                       const solution = document.getElementById('text-input').value;

                       assert.equal(solution, givenSolution, 'The solutions should be equal.');

                       for (let i = 0; i < 9; i++)
                       {
                         for (let j = 0; j < 9; j++)
                         {
                           let cell = rowLabels[i] + colLabels[j];
                           let cellValue = document.getElementById(cell).value;

                           assert
                             .equal(cellValue,
                                    solution[i * 9 + j],
                                    'Grid elements should match solution string characters.');
                         }
                       }

                       done();
                     });
              });
      });
