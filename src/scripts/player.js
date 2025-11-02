import { Gameboard } from "./gameboard.js";

class Player {
  #name; // identifier for player
  #gameboard = new Gameboard();

  constructor(name) {
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  get gameboard() {
    return this.#gameboard;
  }
}

export { Player };
