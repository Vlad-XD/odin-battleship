import { Gameboard } from "./gameboard.js";

class Player {
  #name; // identifier for player
  #gameboard = new Gameboard();
  #isComputer; // indicates if a player is actually a computer

  constructor(name, isComputer = false) {
    this.#name = name;
    this.#isComputer = isComputer;
  }

  get name() {
    return this.#name;
  }

  get gameboard() {
    return this.#gameboard;
  }

  get isComputer() {
    return this.#isComputer;
  }
}

export { Player };
