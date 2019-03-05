import {
  expect,
  use as chaiUse,
} from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { Cell, Grid } from '../lib/grid';
import { PuzzleSolver } from '../lib/puzzle-solver';

chaiUse(sinonChai);

const testPuzzleString = ',,6,3,,,,,,,,,,,,9,3,,1,3,5,,6,9,,,,6,,,,5,,1,,8,,,,,8,,,,,8,,1,,7,,,,4,,,,4,9,,5,8,7,,9,7,,,,,,,,,,,,6,2,,';
const testArray = testPuzzleString.split(',').map(v => v ? parseInt(v) : null);

class PuzzleSolverMock extends PuzzleSolver {
  public possibilityGrid: Grid<Array<number>>;
  public puzzleGrid: Grid<number>;
  public _shouldContinue: boolean;

  public consumePuzzle() { return super.consumePuzzle(); }
  public refreshPossibleCellValues(cell: Cell<number>) { return super.refreshPossibleCellValues(cell); }
  public fillCellIfPossible(cell: Cell<number>) { return super.fillCellIfPossible(cell); }
  public fillCell(puzzleCell: Cell<number>, value: number) { return super.fillCell(puzzleCell, value); }
  public getPossibleValuesForCellBasic(cell: Cell<number>) { return super.getPossibleValuesForCellBasic(cell); }
  public isCellOnlyPlaceValueCanGo(cell: Cell<number>, possibleValue: number) { return super.isCellOnlyPlaceValueCanGo(cell, possibleValue); }
  public flatten(array: any[][]) { return super.flatten(array); }
  public assertProgress() { return super.assertProgress(); }
  public resetForConsumption() { return super.resetForConsumption(); }
  public shouldContinue() { return super.shouldContinue(); }
}

describe('Class: PuzzleSolver', () => {

  describe('Public function: solve', () => {

    let consumePuzzleStub: sinon.SinonStub;
    let shouldContinueStub: sinon.SinonStub;
    let puzzleSolver: PuzzleSolverMock;

    beforeEach(() => {
      const puzzle: Grid<number> = new Grid();
      puzzle.buildFromArray(testArray);
      puzzleSolver = new PuzzleSolverMock(puzzle);

      shouldContinueStub = sinon.stub(puzzleSolver, 'shouldContinue').returns(true);
      consumePuzzleStub = sinon.stub(puzzleSolver, 'consumePuzzle');
    });

    afterEach(() => {
      shouldContinueStub.restore();
      consumePuzzleStub.restore();
    });

    it('should consume the puzzle until shouldContinue is false', () => {
      shouldContinueStub.onCall(3).returns(false);

      puzzleSolver.solve();

      expect(consumePuzzleStub.callCount).to.equal(4);
    });

  });

  describe('Protected function: consumePuzzle', () => {
    let refreshPossibleCellValues: sinon.SinonStub;
    let refreshPossibleValuesStub: sinon.SinonStub;
    let fillCellIfPossibleStub: sinon.SinonStub;
    let puzzleSolver: PuzzleSolverMock;
    let getCellsStub: sinon.SinonStub;
    let cells: Array<Cell<number>>;

    beforeEach(async () => {
      const puzzle: Grid<number> = new Grid();
      puzzle.buildFromArray(testArray);
      puzzleSolver = new PuzzleSolverMock(puzzle);

      cells = [{
        id: 1,
        row: 1,
        column: 1,
        square: 1,
        value: null,
      }, {
        id :2,
        row: 1,
        column: 2,
        square: 1,
        value: 9
      }];

      getCellsStub = sinon.stub(puzzle, 'getCells').returns(cells);
     
      refreshPossibleValuesStub = sinon.stub(puzzleSolver, 'refreshPossibleCellValues');
      fillCellIfPossibleStub = sinon.stub(puzzleSolver, 'fillCellIfPossible');
    });

    afterEach(() => {
      getCellsStub.restore();
      refreshPossibleValuesStub.restore();
      fillCellIfPossibleStub.restore();
    });

    it('should do nothing for cells that are already filled', () => {
      puzzleSolver.consumePuzzle();
      expect(refreshPossibleValuesStub).not.to.have.been.calledWith(cells[1]);
      expect(fillCellIfPossibleStub).not.to.have.been.calledWith(cells[1]);
    });

    it('should refresh the possible values for each cell that is not filled in', () => {
      puzzleSolver.consumePuzzle();
      expect(refreshPossibleValuesStub).to.have.been.calledWith(cells[0]);
    });

    it('should call fillCellIfPossible for each cell in the puzzle', () => {
      puzzleSolver.consumePuzzle();
      expect(fillCellIfPossibleStub).to.have.been.calledWith(cells[0]);
    });

  });

  describe('Protected function: refreshPossibleCellValues', () => {

    let assertProgressStub: sinon.SinonStub;
    let getPossibleValuesForCellBasicStub: sinon.SinonStub;
    let getCellValueStub: sinon.SinonStub;
    let setCellStub: sinon.SinonStub;
    let puzzleSolver: PuzzleSolverMock;
    let cell: Cell<number>;

    beforeEach(() => {
      const puzzle: Grid<number> = new Grid();
      puzzle.buildFromArray(testArray);
      puzzleSolver = new PuzzleSolverMock(puzzle);

      assertProgressStub = sinon.stub(puzzleSolver, 'assertProgress');
      getPossibleValuesForCellBasicStub = sinon.stub(puzzleSolver, 'getPossibleValuesForCellBasic');
      setCellStub = sinon.stub(puzzleSolver.possibilityGrid, 'setCell');
      getCellValueStub = sinon.stub(puzzleSolver.possibilityGrid, 'getCellValue');
      cell = { id: 1, row: 1, column: 1, square: 1, value: 1 };
    });

    afterEach(() => {
      assertProgressStub.restore();
      getPossibleValuesForCellBasicStub.restore();
      setCellStub.restore();
      getCellValueStub.restore();
    });

    it('should get the basic possible values for the cell', () => {
      getCellValueStub.returns([1, 2]);
      getPossibleValuesForCellBasicStub.returns([1]);
      puzzleSolver.refreshPossibleCellValues(cell);
      expect(getPossibleValuesForCellBasicStub).to.have.been.calledWith(cell);
    });

    it('should not assert progress if the new possibilities are the same as the old', () => {
      getCellValueStub.returns([1, 2]);
      getPossibleValuesForCellBasicStub.returns([1, 2]);
      puzzleSolver.refreshPossibleCellValues(cell);
      expect(assertProgressStub).not.to.have.been.called;
    });

    it('should not set new possibilities if the possibilities have not changed', () => {
      getCellValueStub.returns([1, 2]);
      getPossibleValuesForCellBasicStub.returns([1, 2]);
      puzzleSolver.refreshPossibleCellValues(cell);
      expect(setCellStub).not.to.have.been.called;
    });

    it('should set new possible values for the cell', () => {
      const possibilities = [1];
      getPossibleValuesForCellBasicStub.returns(possibilities);
      getCellValueStub.returns([1, 2]);
      puzzleSolver.refreshPossibleCellValues(cell);
      expect(setCellStub).to.have.been.calledWith(cell.id, possibilities);
    });

    it('should assert progress if the new possibilities are different than the old', () => {
      getCellValueStub.returns([1, 2]);
      getPossibleValuesForCellBasicStub.returns([1]);
      puzzleSolver.refreshPossibleCellValues(cell);
      expect(assertProgressStub).to.have.been.called;
    });

  });

  describe('Function: fillCellIfPossible', () => {

    let assertProgressStub: sinon.SinonStub;
    let getCellValueStub: sinon.SinonStub;
    let fillCellStub: sinon.SinonStub;
    let isCellOnlyPlaceValueCanGoStub: sinon.SinonStub;
    let puzzleSolver: PuzzleSolverMock;
    let cell: Cell<number>;
    let possibilities: number[];

    beforeEach(() => {
      const puzzle: Grid<number> = new Grid();
      puzzle.buildFromArray(testArray);
      puzzleSolver = new PuzzleSolverMock(puzzle);

      possibilities = [1, 2, 3];

      assertProgressStub = sinon.stub(puzzleSolver, 'assertProgress');
      fillCellStub = sinon.stub(puzzleSolver, 'fillCell');
      getCellValueStub = sinon.stub(puzzleSolver.possibilityGrid, 'getCellValue').returns(possibilities);
      isCellOnlyPlaceValueCanGoStub = sinon.stub(puzzleSolver, 'isCellOnlyPlaceValueCanGo').returns(false);
      cell = { id: 1, row: 1, column: 1, square: 1, value: 1 };
    });

    afterEach(() => {
      assertProgressStub.restore();
      isCellOnlyPlaceValueCanGoStub.restore();
      fillCellStub.restore();
      getCellValueStub.restore();
    });

    it('should fill the cell if there is only one possibility', () => {
      getCellValueStub.returns([1]);
      puzzleSolver.fillCellIfPossible(cell);
      expect(fillCellStub).to.have.been.calledWith(cell, 1);
    });

    it('should check if cell is only place value can go for each possibility', () => {
      puzzleSolver.fillCellIfPossible(cell);
      expect(isCellOnlyPlaceValueCanGoStub.callCount).to.equal(possibilities.length);
    });

    it('should quit as soon as it finds a match', () => {
      getCellValueStub.returns([1, 2, 3]);
      isCellOnlyPlaceValueCanGoStub.onCall(1).returns(true);
      puzzleSolver.fillCellIfPossible(cell);
      expect(isCellOnlyPlaceValueCanGoStub.callCount).to.equal(2);
    });

    it('should set the cell value as soon as it finds a match', () => {
      getCellValueStub.returns([1, 2, 3]);
      isCellOnlyPlaceValueCanGoStub.onCall(1).returns(true);
      puzzleSolver.fillCellIfPossible(cell);
      expect(fillCellStub).to.have.been.calledWith(cell, 2);
    });

    it('should assert progress if it finds a match', () => {
      isCellOnlyPlaceValueCanGoStub.onCall(1).returns(true);
      puzzleSolver.fillCellIfPossible(cell);
      expect(assertProgressStub).to.have.been.called;
    });
    
  });

  describe('Protected function: fillCell', () => {

    let setPuzzleCellStub: sinon.SinonStub;
    let setSolverCellStub: sinon.SinonStub;
    let puzzleSolver: PuzzleSolverMock;
    let cell: Cell<number>;

    beforeEach(() => {
      const puzzle: Grid<number> = new Grid();
      puzzle.buildFromArray(testArray);
      puzzleSolver = new PuzzleSolverMock(puzzle);

      setPuzzleCellStub = sinon.stub(puzzle, 'setCell');
      setSolverCellStub = sinon.stub(puzzleSolver.possibilityGrid, 'setCell');

      cell = { id: 1, row: 1, column: 1, square: 1, value: null};
    });

    afterEach(() => {
      setPuzzleCellStub.restore();
      setSolverCellStub.restore();
    });

    it('should set the value of the cell', () => {
      puzzleSolver.fillCell(cell, 5);
      expect(setPuzzleCellStub).to.have.been.calledWith(cell.id, 5);
    });

    it('should update the possibility grid', () => {
      puzzleSolver.fillCell(cell, 5);
      expect(setSolverCellStub).to.have.been.calledWith(cell.id, [ 5 ]);
    });

  });

  describe('Protected function: getPossibleValuesForCellBasic', () => {

    let getCellValueStub: sinon.SinonStub;
    let getRowCellValues: sinon.SinonStub;
    let getColumnCellValues: sinon.SinonStub;
    let getSquareCellValues: sinon.SinonStub;
    let puzzleSolver: PuzzleSolverMock;
    let cell: Cell<number>;
    let possibilities: number[];
    let rowValues: number[];
    let columnValues: number[];
    let squareValues: number[];

    beforeEach(() => {
      const puzzle: Grid<number> = new Grid();
      puzzle.buildFromArray(testArray);
      puzzleSolver = new PuzzleSolverMock(puzzle);

      possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      rowValues = [1, 2];
      columnValues = [3, 4];
      squareValues = [5, 6];

      getCellValueStub = sinon.stub(puzzleSolver.possibilityGrid, 'getCellValue').returns(possibilities);
      getRowCellValues = sinon.stub(puzzleSolver.puzzleGrid, 'getRowCellValues').returns(rowValues);
      getColumnCellValues = sinon.stub(puzzleSolver.puzzleGrid, 'getColumnCellValues').returns(columnValues);
      getSquareCellValues = sinon.stub(puzzleSolver.puzzleGrid, 'getSquareCellValues').returns(squareValues);
      cell = { id: 1, row: 1, column: 1, square: 1, value: 1 };
    });

    afterEach(() => {
      getCellValueStub.restore();
      getRowCellValues.restore();
      getColumnCellValues.restore();
      getSquareCellValues.restore();
    });
    
    it('should not return any values already in the row', () => {
      const basicPossibles = puzzleSolver.getPossibleValuesForCellBasic(cell);
      expect(basicPossibles).not.to.include.members(rowValues);

    });

    it('should not return any values already in the column', () => {
      const basicPossibles = puzzleSolver.getPossibleValuesForCellBasic(cell);
      expect(basicPossibles).not.to.include.members(columnValues);
    });

    it('should not return any values already in the square', () => {
      const basicPossibles = puzzleSolver.getPossibleValuesForCellBasic(cell);
      expect(basicPossibles).not.to.include.members(squareValues);
    });

    it('should return all other possibilities', () => {
      const basicPossibles = puzzleSolver.getPossibleValuesForCellBasic(cell);
      expect(basicPossibles).to.include.members([7,8,9]);
    });

  });

  describe('Protected function: isCellOnlyPlaceValueCanGo', () => {

    let puzzleSolver: PuzzleSolverMock;
    let cell: Cell<number>;

    beforeEach(() => {
      const puzzle: Grid<number> = new Grid();
      puzzle.buildFromArray(testArray);
      
      // Note that puzzleSolver is initialized with 
      // every number 1 - 9 as a possible value
      puzzleSolver = new PuzzleSolverMock(puzzle);

      cell = { id: 1, row: 1, column: 1, square: 1, value: 1 };
    });
    
    it('should return true if the value is not a possibility anywhere else in the column', () => {
      // Remove 5 as a possible value throughout the column
      puzzleSolver.possibilityGrid.getColumnCells(1).forEach(cell => {
        if (cell.id === 1) {
          return;
        }

        puzzleSolver.possibilityGrid.setCell(cell.id, cell.value.filter(possibility => possibility !== 5));
      });

      expect(puzzleSolver.isCellOnlyPlaceValueCanGo(cell, 5)).to.be.true;
    });

    it('should return true if the value is not a possibility anywhere else in the row', () => {
      // Remove 5 as a possible value throughout the column
      puzzleSolver.possibilityGrid.getRowCells(1).forEach(cell => {
        if (cell.id === 1) {
          return;
        }

        puzzleSolver.possibilityGrid.setCell(cell.id, cell.value.filter(possibility => possibility !== 5));
      });

      expect(puzzleSolver.isCellOnlyPlaceValueCanGo(cell, 5)).to.be.true;
    });

    it('should return true if the value is not a possibility anywhere else in the square', () => {
      // Remove 5 as a possible value throughout the column
      puzzleSolver.possibilityGrid.getSquareCells(1).forEach(cell => {
        if (cell.id === 1) {
          return;
        }

        puzzleSolver.possibilityGrid.setCell(cell.id, cell.value.filter(possibility => possibility !== 5));
      });

      expect(puzzleSolver.isCellOnlyPlaceValueCanGo(cell, 5)).to.be.true;
    });

    it('should return false if the value is a possibility somewhere else', () => {
      expect(puzzleSolver.isCellOnlyPlaceValueCanGo(cell, 5)).to.be.false;
    });

  });

  describe('Protected function: flatten', () => {

    let puzzleSolver: PuzzleSolverMock;

    beforeEach(() => {
      const puzzle: Grid<number> = new Grid();
      puzzle.buildFromArray(testArray);

      puzzleSolver = new PuzzleSolverMock(puzzle);
    });
    
    it('should turn an array of arrays into 1 array', () => {
      const array = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
      const flattened = puzzleSolver.flatten(array);
      expect(flattened).to.eql([1,2,3,4,5,6,7,8,9]);
    });

  });

  describe('Protected function: assertProgress', () => {

    let puzzleSolver: PuzzleSolverMock;

    beforeEach(() => {
      const puzzle: Grid<number> = new Grid();
      puzzle.buildFromArray(testArray);

      puzzleSolver = new PuzzleSolverMock(puzzle);
    });
    
    it('should set _shouldContinue to true', () => {
      puzzleSolver._shouldContinue = false;
      puzzleSolver.assertProgress();
      expect(puzzleSolver._shouldContinue).to.be.true;
    });

  });

  describe('Protected function: resetForConsumption', () => {

    let puzzleSolver: PuzzleSolverMock;

    beforeEach(() => {
      const puzzle: Grid<number> = new Grid();
      puzzle.buildFromArray(testArray);

      puzzleSolver = new PuzzleSolverMock(puzzle);
    });
    
    it('should set _shouldContinue to true', () => {
      puzzleSolver._shouldContinue = true;
      puzzleSolver.resetForConsumption();
      expect(puzzleSolver._shouldContinue).to.be.false;
    });

  });

  describe('Protected function: assertProgress', () => {

    let puzzleSolver: PuzzleSolverMock;

    beforeEach(() => {
      const puzzle: Grid<number> = new Grid();
      puzzle.buildFromArray(testArray);

      puzzleSolver = new PuzzleSolverMock(puzzle);
    });
    
    it('should return _shouldContinue', () => {
      puzzleSolver._shouldContinue = false;
      expect(puzzleSolver.shouldContinue()).to.be.false;
      puzzleSolver._shouldContinue = true;
      expect(puzzleSolver.shouldContinue()).to.be.true;
    });

  });

});