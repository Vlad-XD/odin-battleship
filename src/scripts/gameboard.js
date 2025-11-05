import { Ship } from "./ship.js";

class Gameboard {
  // directions used to indicate the orientation to place the ship
  static ORIENTATIONS = {
    vertical: "vertical",
    horizontal: "horizontal",
  };

  // used to describe different coordinate states
  static STATES = {
    missed: "missed",
    hit: "hit",
  };

  #rows = 10;
  #cols = 10;
  #grid = [];
  #ships = []; // keeps track of all ships on the gameboard

  constructor() {
    this.initializeGrid();
  }

  // uses row and column values to initilizate the board grid
  initializeGrid() {
    for (let i = 0; i < this.#rows; i++) {
      // board uses null to indicate no ship exists at the location
      this.#grid.push(new Array(this.#cols).fill(null));
    }
  }

  // takes a ship object and places it at the passed coordinates on the gameboard
  placeShip(ship, x, y, orientation) {
    // add the ship to the list of ships
    this.#ships.push(ship);

    // check orientation to place accordingly
    if (orientation === Gameboard.ORIENTATIONS.horizontal) {
      // board adds a reference to the ship at the grid locations where it is located
      for (let i = 0; i < ship.length; i++) {
        this.#grid[x + i][y] = ship;
      }
    }

    if (orientation === Gameboard.ORIENTATIONS.vertical) {
      for (let i = 0; i < ship.length; i++) {
        this.#grid[x][y + i] = ship;
      }
    }
  }

  // returns the state of the gameboard at the passed coordinates
  checkCoordinates(x, y) {
    const gridState = this.#grid[x][y];

    // if the a reference to a ship object is found at the coordinate, return true
    if (gridState instanceof Ship) {
      return true;
    }

    // if the space is empty, return false;
    if (gridState === null) {
      return false;
    }

    // otherwise return the state of the coordinate
    return gridState;
  }

  // hits a ship if it is located in the passed coordinate
  receiveAttack(x, y) {
    const gridState = this.#grid[x][y];

    // if the a reference to a ship object is found at the coordinate, hit that ship
    if (gridState instanceof Ship) {
      gridState.hit();
      this.#grid[x][y] = Gameboard.STATES.hit;
    }

    // if the space was empty, update it to indicated a shot was missed there
    if (gridState === null) {
      this.#grid[x][y] = Gameboard.STATES.missed;
    }
  }

  // returns true if all ships on the board have been sunk
  allShipsSunk() {
    // loop through list of ships, if any are not sunk, return false
    for (const ship of this.#ships) {
      if (!ship.isSunk()) {
        return false;
      }
    }

    return true;
  }
}

export { Gameboard };
