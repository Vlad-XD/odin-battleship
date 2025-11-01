class Ship {
  #length; // iny representinh the length of the ship
  #hits = 0; // int representing number of times the ship has been hit

  constructor(length) {
    this.#length = length;
  }

  get length() {
    return this.#length;
  }

  // increases the number of hits in a ship
  hit() {
    this.#hits++;
  }

  // calculates whether a ship is considered sunk based on its length and the number of hits it has received.
  isSunk() {
    // a ship is sunk if its entire length as been hit
    return this.#hits >= this.#length;
  }
}

export { Ship };
