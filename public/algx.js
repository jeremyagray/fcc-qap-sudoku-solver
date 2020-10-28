// Knuth Algorithm X.
//
// As described by:
//   https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X
//
// Steps:
//
// 1.  If current solution matrix A is empty, the current solution is
// valid; terminate.
// 2.  If not, choose a column c (smallest number of 1s, first one if tie).
// 3.  Choose a row r such that A(r, c) = 1.
// 4.  Include row r in the current solution.
// 5.  For each column j such that A(r, j) = 1
//       For each row i such that A(i, j) = 1
//         delete row i from current solution
//       delete col j from current solution
// 6.  Repeat recursively on the current solution.
//
// Sudoku Exact Cover Matrix modelled on example from Robert Hanson at St Olaf's College:
// https://www.stolaf.edu/people/hansonr/sudoku/exactcovermatrix.htm

'use strict';

function algx(cs, debug = false)
{
  if (debug) console.log(`depth ${cs.depth}:  recurring`);
  if (debug) console.log(`depth ${cs.depth}:  partial solution\n${cs.toString(true)}`);
  if (debug) console.log(`depth ${cs.depth}:  solution rows ${cs.solutionRows}`);
  if (debug) console.log(`depth ${cs.depth}:  covered rows\n${cs.coveredRows}`);
  if (debug) console.log(`depth ${cs.depth}:  covered cols\n${cs.coveredCols}`);

  // 1.  If current solution matrix A is empty, the current solution
  // is valid; terminate.
  if (cs.isEmpty())
  {
    if (debug) console.log(`depth ${cs.depth}:  covered`);
    if (debug) console.log(`depth ${cs.depth}:  partial solution (should be empty)\n${cs.toString(true)}`);
    if (debug) console.log(`depth ${cs.depth}:  solution rows ${cs.solutionRows}`);
    return true;
  }
  else
  {
    let col = cs.chooseCol();
    let rows = cs.chooseRows(col);

    if (rows.length > 0)
    {
      if (debug) console.log(`depth ${cs.depth}:  selected col ${col}`);
      if (debug) console.log(`depth ${cs.depth}:  trying rows ${rows}`);
    }
    else
    {
      if (debug) console.log(`depth ${cs.depth}:  selected col ${col}`);
      if (debug) console.log(`depth ${cs.depth}:  no rows to try`);
      return false;
    }

    for (let i = 0; i < rows.length; i++)
    {
      if (debug) console.log(`depth ${cs.depth}:  partial solution (before cover)\n${cs.toString(true)}`);
      if (debug) console.log(`depth ${cs.depth}:  trying row ${rows[i]}`);
      cs.addSolutionRow(rows[i]);
      if (debug) console.log(`depth ${cs.depth}:  covered rows (before cover)\n${cs.coveredRows}`);
      if (debug) console.log(`depth ${cs.depth}:  covered cols (before cover)\n${cs.coveredCols}`);
      cs.cover(rows[i]);
      if (debug) console.log(`depth ${cs.depth}:  partial solution (after cover)\n${cs.toString(true)}`);
      if (debug) console.log(`depth ${cs.depth}:  covered rows (after cover)\n${cs.coveredRows}`);
      if (debug) console.log(`depth ${cs.depth}:  covered cols (after cover)\n${cs.coveredCols}`);
      if (debug) console.log(`depth ${cs.depth}:  current solution rows are ${cs.solutionRows}`);
      cs.deeper();
      if (debug) console.log(`depth ${cs.depth - 1}: recurring to depth ${cs.depth}`);

      if (algx(cs))
      {
        return true;
      }

      if (debug) console.log(`depth ${cs.depth}: no solution, returning to depth ${cs.depth - 1}`);
      cs.shallower();
      if (debug) console.log(`depth ${cs.depth}:  partial solution (before uncover)\n${cs.toString(true)}`);
      if (debug) console.log(`depth ${cs.depth}:  covered rows (before uncover)\n${cs.coveredRows}`);
      if (debug) console.log(`depth ${cs.depth}:  covered cols (before uncover)\n${cs.coveredCols}`);
      cs.uncover();
      if (debug) console.log(`depth ${cs.depth}:  partial solution (after uncover)\n${cs.toString(true)}`);
      if (debug) console.log(`depth ${cs.depth}:  covered rows (before uncover)\n${cs.coveredRows}`);
      if (debug) console.log(`depth ${cs.depth}:  covered cols (before uncover)\n${cs.coveredCols}`);
      if (debug) console.log(`depth ${cs.depth}: back at depth ${cs.depth}`);
      if (debug) console.log(`depth ${cs.depth}: solution row (before trial removal) ${cs.solutionRows}`);
      cs.removeSolutionRow(rows[i]);
      if (debug) console.log(`depth ${cs.depth}: solution row (after trial removal) ${cs.solutionRows}`);
    }
  }
}

class CurrentSolution
{
  constructor(mat)
  {
    this.A = mat;
    this.rows = mat.length || 0;
    this.cols = (mat.length == 0) ? 0 : mat[0].length;
    this.coveredRows = [];
    this.coveredCols = [];
    this.colOnes = [];
    this.solutionRows = [];
    this.depth = 1;

    for (let i = 0; i < this.rows; i++)
    {
      this.coveredRows.push(0);
      this.solutionRows.push(0);
    }

    for (let i = 0; i < this.cols; i++)
    {
      this.coveredCols.push(0);
    }

    for (let i = 0; i < this.cols; i++)
    {
      let ones = 0;

      for (let j = 0; j < this.rows; j++)
      {
        if (mat[j][i] == 1) ones++;
      }

      this.colOnes.push(ones);
    }
  }

  deeper()
  {
    this.depth++;
  }

  shallower()
  {
    this.depth--;
  }

  isEmpty()
  {
    let rows = 0;
    let cols = 0;
    
    for (let i = 0; i < this.rows; i++)
    {
      if (this.coveredRows[i] == 0)
      {
        rows = true;
        break;
      }
    }

    for (let j = 0; j < this.cols; j++)
    {
      if (this.coveredCols[j] ==  0)
      {
        cols = true;
        break;
      }
    }

    return (! (rows && cols));
  }
  
  // 2.  If not, choose a column c (smallest number of 1s, first one
  // if tie).
  chooseCol()
  {
    let min = null;
    let index = null;

    for (let i = 0; i < this.colOnes.length; i++)
    {
      if (! this.coveredCols[i])
      {
        if (min === null)
        {
          min = this.colOnes[i];
          index = i;
        }
        else if (min > this.colOnes[i])
        {
          min = this.colOnes[i];
          index = i;
        }
      }
    }
    
    return index;
  }
  
  // 3.  Choose the rows r such that A(r, c) = 1.
  chooseRows(col)
  {
    let rows = [];

    for (let i = 0; i < this.rows; i++)
    {
      if (this.A[i][col] == 1 && (! this.coveredRows[i]))
      {
        rows.push(i);
      }
    }

    return rows;
  }
  
  // 5.  For each column j such that A(r, j) = 1
  //       For each row i such that A(i, j) = 1
  //         delete row i from current solution
  //       delete col j from current solution
  cover(row)
  {
    for (let i = 0; i < this.rows; i++)
    {
      for (let j = 0; j < this.cols; j++)
      {
        // if (debug) console.log(row);
        // if (debug) console.log(this.A[row]);
        if (this.A[row][j] == 1 && this.A[i][j] == 1)
        {
          this.coverRow(row);
          this.coverRow(i);
          this.coverCol(j);
        }
        else if (this.A[row][j] == 1)
        {
          this.coverCol(j);
        }
      }
    }

    this.updateColumnOnes();
  }

  uncover()
  {
    for (let i = 0; i < this.rows; i++)
    {
      this.uncoverRow(i);
    }
    
    for (let j = 0; j < this.cols; j++)
    {
      this.uncoverCol(j);
    }

    this.updateColumnOnes();
  }

  updateColumnOnes()
  {
    for (let j = 0; j < this.cols; j++)
    {
      if (! this.coveredCols[j])
      {
        let sum = 0;
        for (let i = 0; i < this.rows; i++)
        {
          if (! this.coveredRows[i])
          {
            sum += this.A[i][j];
          }
        }
        this.colOnes[j] = sum;
      }
      else
      {
        this.colOnes[j] = null;
      }
    }
  }
  
  addSolutionRow(i)
  {
    this.solutionRows[i] = 1;
  }

  removeSolutionRow(i)
  {
    this.solutionRows[i] = 0;
  }

  coverRow(i)
  {
    if (! this.coveredRows[i]) this.coveredRows[i] = this.depth;
  }

  uncoverRow(i)
  {
    if (this.coveredRows[i] == this.depth) this.coveredRows[i] = 0;
  }

  coverCol(j)
  {
    if (! this.coveredCols[j]) this.coveredCols[j] = this.depth;
  }

  uncoverCol(j)
  {
    if (this.coveredCols[j] == this.depth) this.coveredCols[j] = 0;
  }

  // partial()
  // {
  //   let sol = [];
    
  //   for (let i = 0; i < this.rows; i++)
  //   {
  //     if (! this.coveredRows[i])
  //     {
  //       let row = [];
        
  //       for (let j = 0; j < this.cols; j++)
  //       {
  //         if (! this.coveredCols[j])
  //         {
  //           row.push(this.A[i][j]);
  //         }
  //       }
  //       sol.push(row);
  //     }
  //   }

  //   return sol;
  // }

  toString(partial = false)
  {
    let rows = [];

    for (let i = 0; i < this.rows; i++)
    {
      if (partial && this.coveredRows[i])
      {
        continue;
      }
      else
      {
        let row = [];
        for (let j = 0; j < this.cols; j++)
        {
          if (partial && this.coveredCols[j])
          {
            continue;
          }
          else
          {
            row.push(this.A[i][j]);
          }
        }
        rows.push(row.join(''));
      }
    }

    return rows.join('\n');
  }
}

// Prints a sparse exact cover matrix, with either a 1 or nothing for
// each item.
function exactCoverMatrixToString(m)
{
  let rows = [];

  for (let i = 0; i < m.length; i++)
  {
    let str = '';
    for (let j = 0; j < m[i].length; j++)
    {
      if (m[i][j] == 1)
      {
        str += '1';
      }
      else
      {
        str += ' ';
      }
    }
    // str += '\n';
    rows.push(str);
  }

  // console.log(str);
  return rows.join('\n');
}

// Generates an exact cover matrix for sudoku puzzles.
function sudokuExactCoverMatrix()
{
  const rows = 729;
  const cols = 324;
  let m = [];

  for (let i = 0; i < rows; i++)
  {
    let row = Math.floor(i / 81) + 1;
    let col = (Math.floor(i / 9) % 9) + 1;
    let num = i % 9 + 1;
    // m += `R${row}C${col}#${num} `;

    // Draw rows.
    let curRow = [];
    for (let j = 0; j < cols; j++)
    {
      if (j < 81)
      {
        // Constraint:  one number per cell.
        if (j == Math.floor(i / 9))
        {
          // m += '1';
          curRow.push(1);
        }
        else
        {
          // m += ' ';
          curRow.push(0);
        }
      }
      else if (j >= 81 * 1 && j < 81 * 2)
      {
        // Constraint:  one number per row.
        if ((num - 1) == ((j - 81) - ((row - 1) * 9)))
        {
          // m += '1';
          curRow.push(1);
        }
        else
        {
          // m += ' ';
          curRow.push(0);
        }
      }
      else if (j >= 81 * 2 && j < 81 * 3)
      {
        // Constraint:  one number per column.
        if ((i % 81) == (j - (81 * 2)))
        {
          // m += '1';
          curRow.push(1);
        }
        else
        {
          // m += ' ';
          curRow.push(0);
        }
      }
      else if (j >= 81 * 3 && j < 81 * 4)
      {
        // Constraint:  one number per block.
        if (j == 243 + (i % 27) % 9 + (Math.floor(i / 27) * 9) - (Math.floor(i / 81) * 27) + (Math.floor(i / 243) * 27))
        {
          // m += '1';
          curRow.push(1);
        }
        else
        {
          // m += ' ';
          curRow.push(0);
        }
      }
      // else
      // {
      //   // m += ' ';
      //   curRow.push(0);
      // }
    }

    // m += '\n';
    m.push(curRow);
  }

  return m;
}

function testExactCoverMatrix()
{
  return [
    [1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 1],
    [0, 0, 1, 0, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 1, 0, 0, 0, 0, 1]
  ];
}

function solver(coverMatrix, constraints, debug = false)
{
  let cs = new CurrentSolution(coverMatrix);
  
  // Cover the clue rows in the Sudoku cover matrix.
  for (let i = 0; i < constraints.length; i++)
  {
    cs.cover(constraints[i]);
  }

  // Return the solution rows from Algorithm X.
  algx(cs, debug);

  return cs.solutionRows;
}

// module.exports = {
//   solver,
//   sudokuExactCoverMatrix,
//   exactCoverMatrixToString,
//   testExactCoverMatrix,
//   CurrentSolution
// };

export {
  sudokuExactCoverMatrix,
  exactCoverMatrixToString,
  testExactCoverMatrix,
  CurrentSolution
};

export default solver;
