/* 
  A class to create cells that are independent inside a map
  in order to easily manipulate each cell separately
 */
class MapCell {
  constructor({ size, x, y, row, column }) {
    this.size = size;
    [this.x, this.y] = [x, y];
    [this.row, this.column] = [row, column];
    [this.numberOfNeighborsInPath, this.hasEnoughNeighborsInPath] = [0, false];
    this.element = document.elementFromPoint(x, y);
    this.isInPath = this.element && this.element.nodeName === 'path';
    this.showCell = false;
  }

  draw() {
    this.showCell = true;
    $(`#map-cell-${this.row}-${this.column}`).remove();
    $('#map-grid').append(
      `<div id="map-cell-${this.row}-${this.column}"></div>`
    );
    $(`#map-cell-${this.row}-${this.column}`).css({
      position: 'absolute',
      top: `${this.y}px`,
      left: `${this.x}px`,
      width: `${this.size}px`,
      height: `${this.size}px`,
      zIndex: 12345,
      border: this.isInPath ? 'solid 2px yellow' : 'solid 0.5px black'
    });
  }

  setHasEnoughNeighborsInPath(value) {
    this.hasEnoughNeighborsInPath = value;
    if (this.showCell) {
      $(`#map-cell-${this.row}-${this.column}`).css({
        backgroundColor: value ? 'rgba(0, 255, 0, 0.2)' : 'initial'
      });
    }
  }
}
