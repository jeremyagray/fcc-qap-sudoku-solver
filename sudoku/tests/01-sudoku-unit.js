'use strict';

const mocha = require('mocha');
const chai = require('chai');
const assert = chai.assert;
const Sudoku = require('../sudoku.js');

suite('class Sudoku Unit Tests',
      function()
      {
        suiteSetup(
          function()
          {
          });
        
        suite('Sudoku Helper Functions',
              function()
              {
                test('function puzzleStringContainsValidCharacters(str)',
                     function()
                     {
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const empty = '';
                       const tooLong = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const dashes = '1-5--2-84--63-12-7-2--5-----9--1----8-2-3674-3-7-2--9-47---8--1--16----926914-37-';
                       const letters = '1a5bc2d84ef63g12h7i2jk5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const random = 'a;dkfjla;djf';

                       assert.isTrue(Sudoku.puzzleStringContainsValidCharacters(empty), 'str empty should be true.');
                       assert.isTrue(Sudoku.puzzleStringContainsValidCharacters(good), 'str good should be true.');
                       assert.isTrue(Sudoku.puzzleStringContainsValidCharacters(tooLong), 'str tooLong should be true.');

                       assert.isFalse(Sudoku.puzzleStringContainsValidCharacters(dashes), 'str dashes should be false.');
                       assert.isFalse(Sudoku.puzzleStringContainsValidCharacters(letters), 'str letters should be false.');
                       assert.isFalse(Sudoku.puzzleStringContainsValidCharacters(random), 'str random should be false.');
                     });

                test('function countPuzzleStringClues(str)',
                     function()
                     {
                       // 38 clues.
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       assert.equal(Sudoku.countPuzzleStringClues(good), 38, 'str good should have 38 clues.');

                       // Null.
                       const dashes = '1-5--2-84--63-12-7-2--5-----9--1----8-2-3674-3-7-2--9-47---8--1--16----926914-37-';
                       const letters = '1a5bc2d84ef63g12h7i2jk5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const empty = '';
                       const tooLong = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const random = 'a;dkfjla;djf';
                       assert.isNull(Sudoku.countPuzzleStringClues(dashes), 'str dashes should return null.');
                       assert.isNull(Sudoku.countPuzzleStringClues(letters), 'str letters should return null.');

                       assert.isNull(Sudoku.countPuzzleStringClues(tooLong), 'str tooLong should return null.');
                       assert.isNull(Sudoku.countPuzzleStringClues(empty), 'str empty should return null.');
                       assert.isNull(Sudoku.countPuzzleStringClues(random), 'str random should return null.');
                     });

                test('function puzzleStringContainsSufficientClues(str)',
                     function()
                     {
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const empty = '';
                       const tooLong = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const dashes = '1-5--2-84--63-12-7-2--5-----9--1----8-2-3674-3-7-2--9-47---8--1--16----926914-37-';
                       const letters = '1a5bc2d84ef63g12h7i2jk5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const random = 'a;dkfjla;djf';

                       assert.isTrue(Sudoku.puzzleStringContainsSufficientClues(good), 'str good should be true.');

                       assert.isFalse(Sudoku.puzzleStringContainsSufficientClues(tooLong), 'str tooLong should be false.');
                       assert.isFalse(Sudoku.puzzleStringContainsSufficientClues(empty), 'str empty should be false.');
                       assert.isFalse(Sudoku.puzzleStringContainsSufficientClues(dashes), 'str dashes should be false.');
                       assert.isFalse(Sudoku.puzzleStringContainsSufficientClues(letters), 'str letters should be false.');
                       assert.isFalse(Sudoku.puzzleStringContainsSufficientClues(random), 'str random should be false.');
                     });

                test('function isValidPuzzleStringLength(str)',
                     function()
                     {
                       // True.
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const dashes = '1-5--2-84--63-12-7-2--5-----9--1----8-2-3674-3-7-2--9-47---8--1--16----926914-37-';
                       const letters = '1a5bc2d84ef63g12h7i2jk5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

                       // False.
                       const empty = '';
                       const tooLong = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const random = 'a;dkfjla;djf';

                       assert.isTrue(Sudoku.isValidPuzzleStringLength(good), 'str good should be true.');
                       assert.isTrue(Sudoku.isValidPuzzleStringLength(dashes), 'str dashes should be true.');
                       assert.isTrue(Sudoku.isValidPuzzleStringLength(letters), 'str letters should be true.');

                       assert.isFalse(Sudoku.isValidPuzzleStringLength(tooLong), 'str tooLong should be false.');
                       assert.isFalse(Sudoku.isValidPuzzleStringLength(empty), 'str empty should be false.');
                       assert.isFalse(Sudoku.isValidPuzzleStringLength(random), 'str random should be false.');
                     });

                test('function isValidPuzzleString(str)',
                     function()
                     {
                       // True.
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

                       // False.
                       const dashes = '1-5--2-84--63-12-7-2--5-----9--1----8-2-3674-3-7-2--9-47---8--1--16----926914-37-';
                       const letters = '1a5bc2d84ef63g12h7i2jk5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const empty = '';
                       const tooLong = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const random = 'a;dkfjla;djf';

                       // True.
                       assert.isTrue(Sudoku.isValidPuzzleString(good), 'str good should be true.');

                       // False.
                       assert.isFalse(Sudoku.isValidPuzzleString(dashes), 'str dashes should be false.');
                       assert.isFalse(Sudoku.isValidPuzzleString(letters), 'str letters should be false.');
                       assert.isFalse(Sudoku.isValidPuzzleString(tooLong), 'str tooLong should be false.');
                       assert.isFalse(Sudoku.isValidPuzzleString(empty), 'str empty should be false.');
                       assert.isFalse(Sudoku.isValidPuzzleString(random), 'str random should be false.');
                     });
              });

        suite('class Sudoku Methods',
              function()
              {
                test('method Sudoku.puzzleToPuzzleString()',
                     function()
                     {
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

                       const p = new Sudoku.Sudoku(good);
                       p.puzzleToPuzzleString();
                       
                       assert.equal(p.puzzleString, good, 'Puzzle string input and output should be equal.');
                     });

                test('method Sudoku.puzzleToPuzzleString(true) (algx)',
                     function()
                     {
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const goodSol = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

                       const p = new Sudoku.Sudoku(good);
                       p.algxSolve();
                       p.puzzleToPuzzleString(true);
                       
                       assert.equal(p.solutionString, goodSol, 'Solution string input and output should be equal.');
                     });

                test('method Sudoku.puzzleToPuzzleString(true) (naive)',
                     function()
                     {
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const goodSol = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

                       const p = new Sudoku.Sudoku(good);
                       p.solve();
                       p.puzzleToPuzzleString(true);
                       
                       assert.equal(p.solutionString, goodSol, 'Solution string input and output should be equal.');
                     });

                test('method Sudoku.checkSolution()',
                     function()
                     {
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const sol = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

                       const p = new Sudoku.Sudoku(good, sol);
                       p.solve();
                       
                       assert.isTrue(p.checkSolution(), 'Solution string input and calculated solution should be equal.');
                     });

                test('method Sudoku.countPuzzleStringClues()',
                     function()
                     {
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const sol = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

                       const p = new Sudoku.Sudoku(good, sol);
                       
                       assert.equal(p.countPuzzleStringClues(), 38, 'Puzzle should have 38 clues.');
                     });

                test('method Sudoku.toString()',
                     function()
                     {
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const sol = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

                       const p = new Sudoku.Sudoku(good, sol);
                       
                       assert.equal(p.toString(), '1.5..2.84\n..63.12.7\n.2..5....\n.9..1....\n8.2.3674.\n3.7.2..9.\n47...8..1\n..16....9\n26914.37.', 'Puzzle string representations should be equal.');
                     });

                test('method Sudoku.toString(true) (before solving)',
                     function()
                     {
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const sol = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

                       const p = new Sudoku.Sudoku(good, sol);
                       
                       assert.equal(p.toString(true), '1.5..2.84\n..63.12.7\n.2..5....\n.9..1....\n8.2.3674.\n3.7.2..9.\n47...8..1\n..16....9\n26914.37.', 'Solution string representations should be equal.');
                     });

                test('method Sudoku.toString(true) (after solving)',
                     function()
                     {
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const sol = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

                       const p = new Sudoku.Sudoku(good, sol);
                       p.solve()
                       
                       assert.equal(p.toString(true), '135762984\n946381257\n728459613\n694517832\n812936745\n357824196\n473298561\n581673429\n269145378', 'Solution string representations should be equal.');
                     });

                test('method Sudoku.getBlock()',
                     function()
                     {
                       const good = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
                       const sol = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

                       const p = new Sudoku.Sudoku(good, sol);
                       
                       for (let i = 0; i < 9; i++)
                       {
                         for (let j = 0; j < 9; j++)
                         {
                           let block = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                           assert.equal(p.getBlock(i, j), block, `Row ${i}, column ${j} should be in block 0.`);
                         }
                       }
                     });

                test('method Sudoku.isRowValid() good puzzle',
                     function()
                     {
                       const puzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
                       const p = new Sudoku.Sudoku(puzzle);

                       for (let i = 0; i < 9; i++)
                       {
                         assert.isTrue(p.isRowValid(i), `Rows should be valid.`);
                       }
                     });

                test('method Sudoku.isRowValid() bad puzzle',
                     function()
                     {
                       const puzzle = '111111111111111111111111111111111111111111111111111111111111111111111111111111111';
                       const p = new Sudoku.Sudoku(puzzle);

                       for (let i = 0; i < 9; i++)
                       {
                         assert.isFalse(p.isRowValid(i), `Rows should be invalid.`);
                       }
                     });

                test('method Sudoku.isColumnValid() good puzzle',
                     function()
                     {
                       const puzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
                       const p = new Sudoku.Sudoku(puzzle);

                       for (let i = 0; i < 9; i++)
                       {
                         assert.isTrue(p.isColumnValid(i), `Columns should be valid.`);
                       }
                     });

                test('method Sudoku.isColumnValid() bad puzzle',
                     function()
                     {
                       const puzzle = '111111111111111111111111111111111111111111111111111111111111111111111111111111111';
                       const p = new Sudoku.Sudoku(puzzle);

                       for (let i = 0; i < 9; i++)
                       {
                         assert.isFalse(p.isColumnValid(i), `Columns should be invalid.`);
                       }
                     });

                test('method Sudoku.isBlockValid() good puzzle',
                     function()
                     {
                       const puzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
                       const p = new Sudoku.Sudoku(puzzle);

                       for (let i = 0; i < 9; i++)
                       {
                         assert.isTrue(p.isBlockValid(i), `Blocks should be valid.`);
                       }
                     });

                test('method Sudoku.isBlockValid() bad puzzle',
                     function()
                     {
                       const puzzle = '111111111111111111111111111111111111111111111111111111111111111111111111111111111';
                       const p = new Sudoku.Sudoku(puzzle);

                       for (let i = 0; i < 9; i++)
                       {
                         assert.isFalse(p.isBlockValid(i), `Blocks should be invalid.`);
                       }
                     });

                test('method Sudoku.isGood() good puzzle',
                     function()
                     {
                       const puzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
                       const p = new Sudoku.Sudoku(puzzle);

                       assert.isTrue(p.isGood(), `Puzzle should be valid.`);
                     });

                test('method Sudoku.isGood() bad puzzle',
                     function()
                     {
                       const puzzle = '111111111111111111111111111111111111111111111111111111111111111111111111111111111';
                       const p = new Sudoku.Sudoku(puzzle);

                       assert.isFalse(p.isGood(), `Puzzle should be invalid.`);
                     });

                test('method Sudoku.algxSolver() (fcc-qap-sudoku puzzles)',
                     function()
                     {
                       const puzzles = [
                         [
                           '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                           '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
                         ],
                         [
                           '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
                           '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
                         ],
                         [
                           '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                           '218396745753284196496157832531672984649831257827549613962415378185763429374928561'
                         ],
                         [
                           '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
                           '473891265851726394926345817568913472342687951197254638734162589685479123219538746'
                         ],
                         [
                           '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
                           '827549163531672894649831527496157382218396475753284916962415738185763249374928651'
                         ]
                       ];

                       for (let i = 0; i < puzzles.length; i++)
                       {
                         const p = new Sudoku.Sudoku(puzzles[i][0], puzzles[i][1]);
                         p.solve()
                       
                         assert.isTrue(p.checkSolution(), 'Calculated solution should equal given solution.');
                       }
                     });
              });
      });
