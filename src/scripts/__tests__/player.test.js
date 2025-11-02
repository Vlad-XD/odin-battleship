import { Player } from "../player.js";
import { Ship } from "../ship.js";

describe("Player class", () => {
  test("player gameboard can be accessed", () => {
    const player = new Player("Player 1");
    const ship = new Ship(3);
    const gameboard = player.gameboard;

    gameboard.placeShip(ship, 0, 0, "vertical");

    expect(gameboard.allShipsSunk()).toBe(false);

    for (let i = 0; i < ship.length; i++) {
      gameboard.receiveAttack(0, 0 + i);
    }

    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
