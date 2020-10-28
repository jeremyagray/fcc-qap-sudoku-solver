'use strict';

// const algx = require('./algx.js');
import algx from './algx.js';
import {sudokuExactCoverMatrix} from './algx.js';

// Default for a blank square.
const _blank = '.';

// Perform basic validation of the puzzle string.
function isValidPuzzleString(str)
{
  return (isValidPuzzleStringLength(str)
          && puzzleStringContainsValidCharacters(str)
          && puzzleStringContainsSufficientClues(str));
}

// Validates characters in puzzle string.
function puzzleStringContainsValidCharacters(str)
{
  const testRE = new RegExp('[^0-9' + _blank + ']');

  return (! (testRE.test(str)));
}

// Ensures that the puzzle string has sufficient clues (17+).
function puzzleStringContainsSufficientClues(str)
{
  return (countPuzzleStringClues(str) >= 17);
}

// Ensures that the puzzle string is 81 characters long.
function isValidPuzzleStringLength(str)
{
  return (str.length === 81);
}

// Counts clues in puzzle string.
function countPuzzleStringClues(str)
{
  if (isValidPuzzleStringLength(str)
      && puzzleStringContainsValidCharacters(str))
  {
    let count = 0;
    for (let i = 0; i < str.length; i++)
    {
      if (str[i] !== _blank)
      {
        count++;
      }
    }

    return count;
  }
  else
  {
    return null;
  }
}

class Sudoku
{
  constructor(puzzleString, givenSolutionString = '')
  {
    this.blank = _blank;

    if (this.isValidPuzzleString(puzzleString))
    {
      this.puzzleString = puzzleString;
      this.puzzle = this.puzzleStringToPuzzle(puzzleString);
      this.solutionString = puzzleString;
      this.solution = this.puzzleStringToPuzzle(puzzleString);
    }

    if (givenSolutionString !== '' && this.isValidPuzzleString(givenSolutionString))
    {
      this.givenSolutionString = givenSolutionString;
      this.givenSolution = this.puzzleStringToPuzzle(givenSolutionString);
    }
  }

  // Conversion methods.

  // Convert the puzzle (solution) to an 81 character string.
  puzzleToPuzzleString(solution = false)
  {
    let str = '';

    for (let i = 0; i < 9; i++)
    {
      for (let j = 0; j < 9; j++)
      {
        if (solution ? Array.isArray(this.solution[i][j]) : Array.isArray(this.puzzle[i][j]))
        {
          str += this.blank;
        }
        else
        {
          str += (solution ? this.solution[i][j] : this.puzzle[i][j]);
        }
      }
    }


    solution ? this.solutionString = str : this.puzzleString = str;
  }
  
  // Convert an 81 character string to a puzzle or solution.
  puzzleStringToPuzzle(str)
  {
    if (this.isValidPuzzleString(str))
    {
      let puzzle = [];
      let row = [];

      for (let i = 0; i < 9; i++)
      {
        row = [];
        for (let j = 0; j < 9; j++)
        {
          if (str[(i * 9) + j] === '.')
          {
            row.push([]);
          }
          else
          {
            row.push(parseInt(str[(i * 9) + j]));
          }
        }
        puzzle.push(row);
      }

      return puzzle;
    }
  }

  // Converts puzzle/solution to string grid.
  toString(solution = false)
  {
    let rows = [];
    
    for (let i = 0; i < 9; i++)
    {
      let str = '';
      for (let j = 0; j < 9; j++)
      {
        if (solution)
        {
          if (Array.isArray(this.solution[i][j]))
          {
            str += this.blank;
          }
          else
          {
            str += this.solution[i][j];
          }
        }
        else
        {
          if (Array.isArray(this.puzzle[i][j]))
          {
            str += this.blank;
          }
          else
          {
            str += this.puzzle[i][j];
          }
        }
      }
      rows.push(str);
    }

    return rows.join('\n');
  }
  
  // Convert a partial puzzle to row clues to eliminate from the exact
  // cover matrix.
  puzzleToClues()
  {
    let clues = [];

    for (let i = 0; i < 9; i++)
    {
      for (let j = 0; j < 9; j++)
      {
        if (this.puzzleString[(i * 9) + j] !== '.')
        {
          // clues.push([i, j, parseInt(this.puzzleString[(i * 9) + j])]);
          // let row = clues[i][0] * 81 + clues[i][1] * 9 + clues[i][2] - 1
          clues.push(i * 81 + j * 9 + parseInt(this.puzzleString[(i * 9) + j]) - 1);
        }
      }
    }

    return clues;
  }
  
  // Convert the solution rows array from algx() to the appropriate
  // gridded numbers in the solution.
  rowsToSolution(solutionRows)
  {
    for (let i = 0; i < solutionRows.length; i++)
    {
      if (solutionRows[i] !== 0)
      {
        let row = Math.floor(i / 81);
        let col = Math.floor((i - (row * 81)) / 9);
        let num = i - (row * 81) - (col * 9) + 1;
        // console.log(`i: ${row} j: ${col} n: ${num}`);
        this.solution[row][col] = num;
      }
    }
  }

  // Validation methods.

  // Checks if the calculated solution matches the given one.
  checkSolution()
  {
    return (this.solutionString == this.givenSolutionString);
  }

  // Perform basic validation of the puzzle string:
  // 1)  81 characters long.
  // 2)  Only digits or '.'.
  // 3)  More than 17 clues.
  isValidPuzzleString(str)
  {
    return isValidPuzzleString(str);
  }

  // Counts clues in puzzle string.
  countPuzzleStringClues()
  {
    return countPuzzleStringClues(this.puzzleString);
  }
  
  // Determine if puzzle is good (follows Sudoku rules).
  isGood()
  {
    for (let i = 0; i < 9; i++)
    {
      if (! (this.isRowValid(i)
             && this.isColumnValid(i)
             && this.isBlockValid(i)))
      {
        return false;
      }
    }

    return true;
  }

  isValidSet(digits)
  {
    return (digits.length === Array.from(new Set(digits)).length);
  }
  
  isRowValid(r)
  {
    return this.isValidSet(this.getRowDigits(r));
  }

  isColumnValid(c)
  {
    return this.isValidSet(this.getColumnDigits(c));
  }

  isBlockValid(b)
  {
    return this.isValidSet(this.getBlockDigits(b));
  }

  // Location methods.

  // Returns block, LR-TB 0-9.
  getBlock(r, c)
  {
    return Math.floor(r / 3) * 3 + Math.floor(c / 3);
  }

  // Solution methods.

  // Knuth's Algorithm X exact cover solver.  Solves any puzzle.
  algxSolve()
  {
    const constraints = this.puzzleToClues();
    const coverMatrix = sudokuExactCoverMatrix();
    const solutionRows = algx(coverMatrix, constraints);

    this.rowsToSolution(solutionRows);
    this.puzzleToPuzzleString(true);
  }
  
  // Naive solver.  Requires enough correctly located clues to do
  // one-missing solution.
  solve()
  {
    let solved = false;
    this.updatePossibilities();

    while (! solved)
    {
      solved = true;
      rows:
      for (let i = 0; i < 9; i++)
      {
        cols:
        for (let j = 0; j < 9; j++)
        {
          if (Array.isArray(this.solution[i][j])
              && this.solution[i][j].length == 1)
          {
            solved = false;
            this.solution[i][j] = this.solution[i][j][0];
            this.updateRowPossibilities(i);
            this.updateColPossibilities(j);
            break rows;
          }
        }
      }
    }

    this.puzzleToPuzzleString(true);
  }

  getRowDigits(r)
  {
    let digits = [];

    for (let i = 0; i < 9; i++)
    {
      if (! Array.isArray(this.solution[r][i]))
      {
        digits.push(this.solution[r][i]);
      }
    }

    return digits;
  }

  getColumnDigits(c)
  {
    let digits = [];

    for (let i = 0; i < 9; i++)
    {
      if (! Array.isArray(this.solution[i][c]))
      {
        digits.push(this.solution[i][c]);
      }
    }

    return digits;
  }
  
  getBlockDigits(s)
  {
    let digits = [];
    const r = Math.floor(s / 3);
    const rmin = r * 3;
    const rmax = r * 3 + 2;
    const c = s % 3;
    const cmin = c * 3;
    const cmax = c * 3 + 2;

    for (let i = rmin; i <= rmax; i++)
    {
      for (let j = cmin; j <= cmax; j++)
      {
        if (! Array.isArray(this.solution[i][j]))
        {
          digits.push(this.solution[i][j]);
        }
      }
    }

    return digits;
  }
  
  updateRowPossibilities(r)
  {
    for (let i = 0; i < 9; i++)
    {
      if (Array.isArray(this.solution[r][i]))
      {
        this.solution[r][i] = this.getCellPossibilities(r, i);
      }
    }
  }

  updateColPossibilities(c)
  {
    for (let i = 0; i < 9; i++)
    {
      if (Array.isArray(this.solution[i][c]))
      {
        this.solution[i][c] = this.getCellPossibilities(i, c);
      }
    }
  }

  updatePossibilities()
  {
    for (let i = 0; i < 9; i++)
    {
      this.updateRowPossibilities(i);
    }
  }
  
  getCellPossibilities(r, c)
  {
    // Set of digits.
    let digits = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    // console.log(digits);

    // Get the digits in the row, column, and block.
    const row = new Set(this.getRowDigits(r));
    // console.log(row);
    const col = new Set(this.getColumnDigits(c));
    // console.log(col);
    const block = new Set(this.getBlockDigits(this.getBlock(r, c)));

    // Eliminate digits in the row, column, and block from digits.

    for (let elem of row)
    {
      digits.delete(elem);
    }

    for (let elem of col)
    {
      digits.delete(elem);
    }

    for (let elem of block)
    {
      digits.delete(elem);
    }

    return Array.from(digits);
  }
}

// module.exports = {
//   Sudoku,
//   countPuzzleStringClues,
//   isValidPuzzleString,
//   isValidPuzzleStringLength,
//   puzzleStringContainsSufficientClues,
//   puzzleStringContainsValidCharacters,
// };

export {
  isValidPuzzleString
};

export default Sudoku;
