import {
  expect,
  use as chaiUse,
} from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { Grid } from '../lib/grid';
import { PuzzleValidator } from '../lib/puzzle-validator';

chaiUse(sinonChai);

// This is a confirmed valid and completed puzzle
const testPuzzleString = '9,2,6,3,4,7,8,5,1,7,8,4,2,1,5,9,3,6,1,3,5,8,6,9,4,7,2,6,7,3,9,5,4,1,2,8,2,4,9,1,8,3,7,6,5,8,5,1,6,7,2,3,9,4,3,6,2,4,9,1,5,8,7,4,9,7,5,2,8,6,1,3,5,1,8,7,3,6,2,4,9';
const testArray = testPuzzleString.split(',').map(v => v ? parseInt(v) : null);


describe('Class: PuzzleValidator', () => {
  
  describe('Public function: isPuzzleValid', () => {

    let puzzle: Grid<number>;

    beforeEach(() => {
      puzzle = new Grid();
      puzzle.buildFromArray(testArray);
    });
    
    it('should return false if there are duplicate values in the same row', () => {
      // 8 is already in cell id 7 in row 1
      puzzle.setCell(1, 8);
      expect(PuzzleValidator.isPuzzleValid(puzzle)).to.be.false;
    });

    it('should return false if there are duplicate values in the same column', () => {
      // 3 is already in cell id 55 in column 1
      puzzle.setCell(1, 3);
      expect(PuzzleValidator.isPuzzleValid(puzzle)).to.be.false;
    });

    it('should return false if there are duplicate values in the same square', () => {
      // 3 is already in cell id 21 in square 1
      puzzle.setCell(1, 5);
      expect(PuzzleValidator.isPuzzleValid(puzzle)).to.be.false;
    });

    it('should return true if none of the above rules are broken', () => {
      expect(PuzzleValidator.isPuzzleValid(puzzle)).to.be.true;
    });

    it('should not consider nulls duplicates', async () => {
      puzzle.setCell(5, null);
      puzzle.setCell(6, null);
      expect(PuzzleValidator.isPuzzleValid(puzzle)).to.be.true;
    });

  });

});