/* 
  A function to create a grid surrounding a map
 */
function createMapGrid({
  clientRect,
  cellSize,
  maxNumberOfNeighbors = 8,
  minNumberOfNeighbors = 4,
  showGrid = false,
}) {
  const mapGrid = new MapGrid({
    cellSize,
    x: clientRect.x,
    y: clientRect.y,
    width: clientRect.width,
    height: clientRect.height,
  });

  if (showGrid) {
    mapGrid.draw();
  }
  mapGrid.countCellsInPath();
  mapGrid.countNumberOfNeighborsInPath();

  /* check if the there are some cells with the required neighbors
  which are in path. 4 is the minimum number of neighbors */
  for (let i = maxNumberOfNeighbors; i >= minNumberOfNeighbors; i--) {
    if (mapGrid.numberOfCellsWithEnoughNeighborsInPath === 0) {
      mapGrid.countCellsWithEnoughNeighborsInPath(i);
    } else {
      break;
    }
  }

  const randomCell = mapGrid.getRandomCellWithEnoughNeighborsInPath();

  return findBetterPosition(mapGrid, randomCell);
}

const findBetterPosition = (mapGrid, randomCell) => {
  let cell = randomCell;
  const { row, column } = randomCell;

  // if the neighbor on the right has one cell in path
  if (
    mapGrid.cells[row][column + 1] &&
    mapGrid.cells[row][column + 1].isInPath
  ) {
    cell = {
      ...cell,
      x: randomCell.x + randomCell.size / 3,
    };
  }

  // if the neighbor on the right has one cell in path which in turn has many neighbors
  if (
    mapGrid.cells[row][column + 1] &&
    mapGrid.cells[row][column + 1].hasEnoughNeighborsInPath
  ) {
    cell = {
      ...cell,
      x: randomCell.x + randomCell.size,
    };
  }

  // if the neighbor at the top has one cell in path
  if (mapGrid.cells[row + 1] && mapGrid.cells[row + 1][column].isInPath) {
    cell = {
      ...cell,
      y: randomCell.y - randomCell.size / 2,
    };
  }

  // if the neighbor at the top has one cell in path which in turn has many neighbors
  if (
    mapGrid.cells[row + 1] &&
    mapGrid.cells[row + 1][column].hasEnoughNeighborsInPath
  ) {
    cell = {
      ...cell,
      y: randomCell.y - randomCell.size,
    };
  }

  // if the neighbor at the bottom has one cell in path which in turn has many neighbors
  if (
    mapGrid.cells[row + 1] &&
    mapGrid.cells[row + 1][column].hasEnoughNeighborsInPath
  ) {
    cell = {
      ...cell,
      y: randomCell.y + randomCell.size,
    };
  }

  return cell;
};
