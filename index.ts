import { Grid } from './lib/grid';
import { PuzzleSolver } from './lib/puzzle-solver';
import { PuzzleValidator } from './lib/puzzle-validator';

const puzzleStrings = [];

puzzleStrings.push(',,6,3,,,,,,,,,,,,9,3,,1,3,5,,6,9,,,,6,,,,5,,1,,8,,,,,8,,,,,8,,1,,7,,,,4,,,,4,9,,5,8,7,,9,7,,,,,,,,,,,,6,2,,');

// Easy puzzles
puzzleStrings.push(',,,8,,5,,,,,3,,,6,,,,7,,9,,,,3,8,,,,4,7,9,5,,3,,,,,,,7,1,,9,,,,,2,,,5,,,1,,,,,2,4,8,,,,9,,,,,5,,,,,,,6,,,');

// Medium puzzles
// https://www.puzzles.ca/sudoku_puzzles/sudoku_medium_481.html
puzzleStrings.push(',,,,,,,,6,4,5,,6,,,,,2,,,,,8,3,7,,,,,3,,,,,,4,7,,4,,,,,5,,9,,6,,,8,,3,,,6,,,1,7,,,,,,,,,9,,,,,,,5,6,,,,');

// Hard puzzles
// 
puzzleStrings.push(',,7,8,,,,9,,4,1,,,,,,5,,,6,,,,,8,2,,3,,,,8,,,,9,,,,,,7,,,3,,,4,3,,6,,,,,,,,2,4,5,,,,,,,1,,,,,9,,,,,,,,6');

const puzzleArrays = puzzleStrings.map(str => str.split(',').map(v => v ? parseInt(v) : null));

for (const puzzleArray of puzzleArrays) {
  console.log();

  const puzzle: Grid<number> = new Grid();
  puzzle.buildFromArray(puzzleArray);

  console.log('Puzzle');
  puzzle.print();

  const puzzleSolver = new PuzzleSolver(puzzle);
  puzzleSolver.solve();

  if (!PuzzleValidator.isPuzzleValid(puzzle)) {
    throw new Error('Invalid solution');
  }

  console.log('Solution');
  puzzle.print();
}
