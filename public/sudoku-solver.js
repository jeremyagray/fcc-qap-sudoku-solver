'use strict';

import Sudoku from './sudoku.js';
import {isValidPuzzleString} from './sudoku.js';
// import { puzzlesAndSolutions } from './puzzle-strings.js';

const textArea = document.getElementById('text-input');
const initialPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

function validChars(str)
{
  return (str !== null
          && str !== undefined
          && str !== ''
          && str.length === 1
          && /[1-9]/.test(str));
}

function validPuzzle(str)
{
  if (isValidPuzzleString(str))
  {
    let p = new Sudoku(str);
    return p.isGood();
  }
  else
  {
    return false;
  }
}

// Class/ID names for grid squares.
// Rows: A to I.
// Cols: 1 to 9.
function loadGrid(puzzle)
{
  const rowLabels = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];
  const colLabels = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];

  for (let i = 0; i < rowLabels.length; i++)
  {
    for (let j = 0; j < colLabels.length; j++)
    {
      let cell = rowLabels[i] + colLabels[j];

      if (validChars(puzzle[i * 9 + j]))
      {
        document.getElementById(cell).value = puzzle[i * 9 + j];
      }
      else
      {
        document.getElementById(cell).value = '';
      }

      document.getElementById(cell).classList.remove('computed');
      document.getElementById(cell).classList.remove('given');
    }
  }

  return document.getElementById('sudoku-grid');
}

function updateAndColorGrid(solution, puzzle)
{
  const rowLabels = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];
  const colLabels = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];

  for (let i = 0; i < rowLabels.length; i++)
  {
    for (let j = 0; j < colLabels.length; j++)
    {
      let cell = rowLabels[i] + colLabels[j];
      document.getElementById(cell).value = solution[i * 9 + j];

      if (puzzle[i * 9 + j] === '.')
      {
        document.getElementById(cell).classList.add('computed');
      }
      else
      {
        document.getElementById(cell).classList.add('given');
      }
    }
  }
}

function updateGrid()
{
  const puzzle = document.getElementById('text-input').value;
  if (validPuzzle(puzzle))
  {
    loadGrid(puzzle);
    clearError();
    return true;
  }
  else
  {
    loadGrid(puzzle);
    displayError("Error: Expected puzzle to be 81 characters long.");
    return false;
  }
}

function displayError(msg)
{
  if (document.getElementById('bad-length-error') === null)
  {
    const errorMsg = document.createTextNode(msg);
    const errorP = document.createElement('p');
    errorP.id = 'bad-length-error';
    errorP.appendChild(errorMsg);
    document.getElementById('error-msg').appendChild(errorP);
  }
}

function clearError()
{
  if (document.getElementById('bad-length-error') !== null)
  {
    document
      .getElementById('error-msg')
      .removeChild(document
                   .getElementById('error-msg')
                   .firstElementChild);
  }
}

function updateString()
{
  const rowLabels = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];
  const colLabels = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
  let puzzle = '';

  for (let i = 0; i < rowLabels.length; i++)
  {
    for (let j = 0; j < colLabels.length; j++)
    {
      let cell = rowLabels[i] + colLabels[j];
      
      if (validChars(document.getElementById(cell).value))
      {
        puzzle += document.getElementById(cell).value
        document.getElementById(cell).classList.remove('invalid-input');
      }
      else if (document.getElementById(cell).value == '')
      {
        puzzle += '.'
        document.getElementById(cell).classList.remove('invalid-input');
      }
      else
      {
        puzzle += '.'
        document.getElementById(cell).classList.add('invalid-input');
      }
    }
  }

  document.getElementById('text-input').value = puzzle;
}

function clearGrid()
{
  const rowLabels = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];
  const colLabels = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];

  for (let i = 0; i < rowLabels.length; i++)
  {
    for (let j = 0; j < colLabels.length; j++)
    {
      let cell = rowLabels[i] + colLabels[j];
      document.getElementById(cell).value = '';
      document.getElementById(cell).classList.remove('given');
      document.getElementById(cell).classList.remove('computed');
    }
  }
}

function clearPuzzleString()
{
  textArea.value = '';
}

function clearAll()
{
  clearGrid();
  clearPuzzleString();
  clearError();
}

function solve()
{
  const puzzle = document.getElementById('text-input').value;

  // Pass puzzle string to solver and get back solution.
  let p = new Sudoku(puzzle);
  p.algxSolve()
  const solution = p.solutionString;

  // Update and color according to whether cells were calculated.
  updateAndColorGrid(solution, puzzle);
  updateString(solution);
}

// Load the initial puzzle.
document.addEventListener('DOMContentLoaded', () =>
                          {
                            textArea.value = initialPuzzle;
                            loadGrid(initialPuzzle);
                          });

// Tie together listeners and functions.
document
  .getElementById('clear-button')
  .addEventListener('click', clearAll);
document
  .getElementById('solve-button')
  .addEventListener('click', solve);
document
  .getElementById('text-input')
  .addEventListener('input', updateGrid);
document
  .getElementById('sudoku-grid')
  .addEventListener('input', updateString);

try
{
  module.exports = {
    loadGrid,
    updateGrid,
    updateString,
    validChars,
    validPuzzle
  };
}
catch (error)
{
}
