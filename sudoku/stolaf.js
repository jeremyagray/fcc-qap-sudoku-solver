function som()
{
  const rows = 729;
  const cols = 324;
  let m = '';

  let lineA = '       ';
  let lineB = '       ';
  for (let j = 0; j < cols; j++)
  {
    if (j < 81)
    {
      if (j % 10 == 0)
      {
        lineA += j / 10;
      }
      else
      {
        lineA += ' ';
      }
      lineB += j % 10;
      if (j == 80)
      {
        lineA += ' ';
        lineB += ' ';
      }
    }
    else
    {
      let group = Math.floor(j / 81);
      if ((j - (81 * group)) % 9 == 0)
      {
        lineA += (j - (81 * group)) / 9;
      }
      else
      {
        lineA += ' ';
      }
      lineB += (j - (81 * group)) % 9 + 1;
      if (j == (81 * (group + 1) - 1))
      {
        lineA += ' ';
        lineB += ' ';
      }
    }
  }

  m = lineA + '\n' + lineB + '\n';
  
  for (let i = 0; i < rows; i++)
  {
    let row = Math.floor(i / 81) + 1;
    let col = (Math.floor(i / 9) % 9) + 1;
    let num = i % 9 + 1;
    m += `R${row}C${col}#${num} `;

    // Draw rows.
    for (let j = 0; j < cols; j++)
    {
      if (j < 81)
      {
        // Constraint:  one number per cell.
        if (j == Math.floor(i / 9))
        {
          m += '1';
        }
        else
        {
          m += ' ';
        }
      }
      else if (j >= 81 * 1 && j < 81 * 2)
      {
        // Constraint:  one number per row.
        if ((num - 1) == ((j - 81) - ((row - 1) * 9)))
        {
          m += '1';
        }
        else
        {
          m += ' ';
        }
      }
      else if (j >= 81 * 2 && j < 81 * 3)
      {
        // Constraint:  one number per column.
        if ((i % 81) == (j - (81 * 2)))
        {
          m += '1';
        }
        else
        {
          m += ' ';
        }
      }
      else if (j >= 81 * 3 && j < 81 * 4)
      {
        // Constraint:  one number per block.
        if (j == 243 + (i % 27) % 9 + (Math.floor(i / 27) * 9) - (Math.floor(i / 81) * 27) + (Math.floor(i / 243) * 27))
        {
          m += '1';
        }
        else
        {
          m += ' ';
        }
      }
      else
      {
        m += ' ';
      }

      // Draw vertical dividing lines.
      if (j % 81 == 80)
      {
        m += '|';
      }
    }

    m += '\n';

    // Draw horizontal dividing lines.
    if (i % 9 == 8)
    {
      let line = ''
      // Seven leading dashes, plus four dividing lines.
      for (let k = 0; k < cols + 7 + 4; k++)
      {
        line += '-';
      }
      m += line + '\n';
    }
  }

  return m;
}
