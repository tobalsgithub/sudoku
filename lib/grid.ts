export interface Cell<T> {
  id: number;
  row: number;
  column: number;
  square: number;
  value?: T | null;
}

export interface Row<T> {
  id: number;
  cells: Cell<T>[];
}

export interface Column<T> {
  id: number;
  cells: Cell<T>[];
}

export interface Square<T> {
  id: number;
  cells: Cell<T>[];
}

export class Grid<T> {

  public rows: IterableIterator<Row<T>>;
  public columns: IterableIterator<Column<T>>;
  public cells: IterableIterator<Cell<T>>;

  protected gridArray: Cell<T>[];
  private readonly numberOfRows: number = 9;
  private readonly numberOfColumns: number = 9;
  private readonly squareSize: number = 3;

  constructor() {   

    this.fillWithNullCells();

    this.rows = buildIterator({ 
      max: this.numberOfRows,
      valueFn: this.getRow.bind(this),
    });
    this.columns = buildIterator({ 
      max: this.numberOfColumns,
      valueFn: this.getColumn.bind(this),
    });
    this.cells = buildIterator({ 
      max: this.numberOfRows * this.numberOfColumns,
      valueFn: this.getCell.bind(this),
    });
  }

  private fillWithNullCells() {

    const getSquare = (index: number) => {
      return (Math.floor(index / 27) * 3) + (Math.floor((index % 9) / 3)) + 1;
    };

    this.gridArray = new Array(this.numberOfColumns * this.numberOfRows)
    .fill(null)
    .map((_, index) => {
      return {
        id: index + 1,
        row: Math.floor(index / 9) + 1,
        column: (index % 9) + 1,
        square: getSquare(index),
        value: null,
      };
    });
  }

  public buildFromArray(arr: T[]) {
    if (arr.length !== this.numberOfColumns * this.numberOfRows) {
      throw new Error('Invalid input array: wrong number of entries');
    }

    arr.forEach((value, index) => this.setCell(index + 1, value));
  }

  public print() {
    for (const row of this.rows) {
      const printableRow = row.cells
      .map(cell => cell.value ? cell.value.toString() : '_')
      .map(str => ` ${str} `)
      .join('|');
      console.log(printableRow);
    }
  }

  public getCells(): Array<Cell<T>> {
    return this.gridArray;
  }

  public getRow(rowId: number): Row<T> {
    return {
      id: rowId,
      cells: this.gridArray.filter(cell => cell.row === rowId),
    };
  }

  public getRowCells(rowId: number): Cell<T>[] {
    return this.getRow(rowId).cells;
  }

  public getRowCellValues(rowId: number): T[] {
    return this.getRowCells(rowId).map(cell => cell.value);
  }

  public getColumn(columnId: number): Column<T> {
    return {
      id: columnId,
      cells: this.gridArray.filter(cell => cell.column === columnId),
    };
  }

  public getColumnCells(columnId: number): Cell<T>[] {
    return this.getColumn(columnId).cells;
  }

  public getColumnCellValues(columnId: number): T[] {
    return this.getColumnCells(columnId).map(cell => cell.value);
  }

  public getSquare(squareId: number): Column<T> {
    return {
      id: squareId,
      cells: this.gridArray.filter(cell => cell.square === squareId),
    };
  }

  public getSquareCells(squareId: number): Cell<T>[] {
    return this.getSquare(squareId).cells;
  }

  public getSquareCellValues(squareId: number): T[] {
    return this.getSquareCells(squareId).map(cell => cell.value);
  }

  public getCell(cellId: number): Cell<T> {
    return this.gridArray.find(cell => cell.id === cellId);
  }

  public getCellValue(cellId: number): T {
    return this.getCell(cellId).value;
  }

  public setCell(cellId: number, value: T) {
    const cell = this.getCell(cellId);
    cell.value = value;
  }

  public removeCellFromCellList(cellId: number, list: Array<Cell<T>>): Array<Cell<T>> {
    return list.filter(listCell => listCell.id !== cellId);
  }
}

interface iterableConfig<T>{
  max: number;
  valueFn: (index: number) => T;
}

const buildIterator = <T>(config: iterableConfig<T>):  IterableIterator<T> => {

  let current = 0;

  return {

    next: (): IteratorResult<T> => {
      current++;

      if (current > config.max) {
        current = 0;
        
        return {
          done: true,
          value: null
        };
      }

      return {
        done: false,
        value: config.valueFn(current),
      }
    },

    [Symbol.iterator](): IterableIterator<T> {
      return this;
    }
  }
}