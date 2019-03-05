import { Grid, Cell } from './grid'

export class PuzzleSolver {

  private readonly possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  protected possibilityGrid: Grid<Array<number>> = new Grid();
  protected puzzleGrid: Grid<number>;
  protected _shouldContinue: boolean;

  constructor(puzzle: Grid<number>) {
    this.puzzleGrid = puzzle;

    this.initializePossibleValues();
  }

  private initializePossibleValues() {
    this.possibilityGrid.buildFromArray(Array(81).fill(this.possibleValues));
    this.puzzleGrid.getCells().filter(cell => !!cell.value)
    .forEach(cell => this.possibilityGrid.setCell(cell.id, [cell.value]));
  }

  public printPossibilities() {
    let totalPossibilities = 1;

    for (const row of this.possibilityGrid.rows) {
      console.log(`Row ${row.id}`);

      for (const cell of row.cells) {
        totalPossibilities *= cell.value.length;
        console.log(`Column ${cell.column}: ${cell.value.join(', ').toString()}`);
      }
    }

    console.log(`Total Possibilities: ${totalPossibilities}`);
  }

  public solve() {
    let count = 1;
    do {
      this.resetForConsumption();
      count++;
      this.consumePuzzle();
    } while (this.shouldContinue());

    console.log(`Looped through puzzle ${count} times`);
  }

  protected consumePuzzle() {
    this.puzzleGrid.getCells()
    .filter(cell => !cell.value)
    .forEach(cell => {
      this.refreshPossibleCellValues(cell);
      this.fillCellIfPossible(cell);
    });
  }

  protected refreshPossibleCellValues(cell: Cell<number>) {
    const refreshedPossibilities = this.getPossibleValuesForCellBasic(cell);

    if (refreshedPossibilities.length === this.possibilityGrid.getCellValue(cell.id).length) {
      return;
    }

    this.assertProgress();

    this.possibilityGrid.setCell(cell.id, refreshedPossibilities);
  }

  protected fillCellIfPossible(puzzleCell: Cell<number>): boolean {
    const possibleValues = this.possibilityGrid.getCellValue(puzzleCell.id);

    if (possibleValues.length === 1) {
      this.fillCell(puzzleCell, possibleValues[0]);
      this.assertProgress();
      return;
    }

    for (const possibleValue of possibleValues) {
      if (!this.isCellOnlyPlaceValueCanGo(puzzleCell, possibleValue)) {
        continue;
      }

      this.fillCell(puzzleCell, possibleValue);
      this.assertProgress();
      return;       
    }
  }

  protected fillCell(puzzleCell: Cell<number>, value: number) {
    this.puzzleGrid.setCell(puzzleCell.id, value);
    this.possibilityGrid.setCell(puzzleCell.id, [ value ]);
  }

  protected getPossibleValuesForCellBasic(cell: Cell<number>): Array<number> {
    return this.possibilityGrid.getCellValue(cell.id).filter(value => {
      return !this.puzzleGrid.getRowCellValues(cell.row).includes(value) &&
      !this.puzzleGrid.getColumnCellValues(cell.column).includes(value) &&
      !this.puzzleGrid.getSquareCellValues(cell.square).includes(value);
    })
  }

  protected isCellOnlyPlaceValueCanGo(puzzleCell: Cell<number>, value: number) {
    return this.isCellOnlyPlaceValueCanGoInColumn(puzzleCell, value) ||
    this.isCellOnlyPlaceValueCanGoInRow(puzzleCell, value) ||
    this.isCellOnlyPlaceValueCanGoInSquare(puzzleCell, value);
  }

  private isCellOnlyPlaceValueCanGoInColumn(puzzleCell: Cell<number>, value: number) {

    const columnCells = this.possibilityGrid.getColumnCells(puzzleCell.column);
    
    const cellList = this.possibilityGrid.removeCellFromCellList(puzzleCell.id, columnCells);
    
    return !this.flatten(cellList.map(cell => cell.value)).includes(value);
  }

  private isCellOnlyPlaceValueCanGoInRow(puzzleCell: Cell<number>, value: number) {

    const rowCells = this.possibilityGrid.getRowCells(puzzleCell.row);
    
    const cellList = this.possibilityGrid.removeCellFromCellList(puzzleCell.id, rowCells);
    
    return !this.flatten(cellList.map(cell => cell.value)).includes(value);
  }

  private isCellOnlyPlaceValueCanGoInSquare(puzzleCell: Cell<number>, value: number) {

    const squareCells = this.possibilityGrid.getSquareCells(puzzleCell.square);
    
    const cellList = this.possibilityGrid.removeCellFromCellList(puzzleCell.id, squareCells);
    
    return !this.flatten(cellList.map(cell => cell.value)).includes(value);
  }

  protected flatten(array: any[][]): Array<any> {
    return array.reduce((flattened, innerArray) => {
        return flattened.concat(innerArray);
    });
  }

  protected assertProgress() {
    this._shouldContinue = true;
  }

  protected resetForConsumption() {
    this._shouldContinue = false;
  }

  protected shouldContinue() {
    return this._shouldContinue;
  }
}