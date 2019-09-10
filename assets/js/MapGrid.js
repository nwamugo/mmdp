/* 
  A class to create a grid surrounding a map
 */
class MapGrid {
  constructor({ cellSize, x, y, width, height }) {
    this.cellSize = cellSize;
    [this.x, this.y] = [x, y];
    this.numberOfRows = Math.floor(height / cellSize);
    this.numberOfColumns = Math.floor(width / cellSize);
    this.numberOfCellsInPath = 0;
    this.numberOfCellsWithEnoughNeighborsInPath = 0;
    this.cells = Array.from(
      Array(this.numberOfRows),
      () => new Array(this.numberOfColumns)
    );

    for (let row = 0; row < this.numberOfRows; row++) {
      for (let column = 0; column < this.numberOfColumns; column++) {
        this.cells[row][column] = new MapCell({
          size: this.cellSize,
          x: this.x + this.cellSize * column,
          y: this.y + this.cellSize * row,
          row,
          column
        });
      }
    }
  }

  draw() {
    $('#map-grid').remove();
    $('body').append('<div id="map-grid"></div>');
    this.cells.forEach(cells => cells.forEach(cell => cell.draw()));
  }

  isValidPosition(row, column) {
    if (
      column >= 0 &&
      column < this.numberOfColumns &&
      row >= 0 &&
      row < this.numberOfRows
    ) {
      return true;
    }
    return false;
  }

  countCellsInPath() {
    this.numberOfCellsInPath = 0;
    this.cells.forEach(cells => {
      cells.forEach(cell => {
        if (cell.isInPath) {
          this.numberOfCellsInPath++;
        }
      });
    });
  }

  getNeighbors(currentCell) {
    let neighbors = [];
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        const neighborRow = currentCell.row + xOffset;
        const neighborColumn = currentCell.column + yOffset;
        if (this.isValidPosition(neighborRow, neighborColumn)) {
          const neighborCell = this.cells[neighborRow][neighborColumn];
          neighbors = [...neighbors, neighborCell];
        }
      }
    }

    return neighbors.filter(
      ({ row, column }) =>
        row !== currentCell.row || column !== currentCell.column
    );
  }

  countNumberOfNeighborsInPath() {
    this.cells.forEach(cells => {
      cells.forEach(cell => {
        const currentCell = cell;
        currentCell.numberOfNeighborsInPath = 0;
        this.getNeighbors(cell).forEach(
          neighbor => neighbor.isInPath && currentCell.numberOfNeighborsInPath++
        );
      });
    });
  }

  countCellsWithEnoughNeighborsInPath(numberOfCells) {
    this.numberOfCellsWithEnoughNeighborsInPath = 0;
    this.cells.forEach(cells =>
      cells.forEach(cell => {
        if (cell.isInPath && cell.numberOfNeighborsInPath === numberOfCells) {
          cell.setHasEnoughNeighborsInPath(true);
          this.numberOfCellsWithEnoughNeighborsInPath++;
        } else {
          cell.setHasEnoughNeighborsInPath(false);
        }
      })
    );
    return this.numberOfCellsWithEnoughNeighborsInPath;
  }

  getRandomCellWithEnoughNeighborsInPath() {
    let randomCell = {};
    for (let row = 0; row < this.numberOfRows; row++) {
      for (let column = 0; column < this.numberOfColumns; column++) {
        if (this.cells[row][column].hasEnoughNeighborsInPath) {
          return this.cells[row][column];
        }
        randomCell = this.cells[row][column];
      }
    }

    return randomCell;
  }
}
