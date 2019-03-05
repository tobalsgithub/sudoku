import { Grid } from './grid';

export class PuzzleValidator {
  public static isPuzzleValid(puzzle: Grid<number>): boolean {

    for (const cell of puzzle.cells) {
      if (cell.value === null) {
        continue;
      }

      const row = puzzle.getRowCellValues(cell.row);
      if (row.lastIndexOf(cell.value) > row.indexOf(cell.value)) {
        return false;
      }

      const column = puzzle.getColumnCellValues(cell.column);
      if (column.lastIndexOf(cell.value) > column.indexOf(cell.value)) {
        return false;
      }

      const square = puzzle.getSquareCellValues(cell.square);
      if (square.lastIndexOf(cell.value) > square.indexOf(cell.value)) {
        return false;
      }
    }

    return true;
  }
}