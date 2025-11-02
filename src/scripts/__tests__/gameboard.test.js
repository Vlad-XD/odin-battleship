import { Ship } from "../ship.js";
import { Gameboard } from "../gameboard.js";

describe("Gameboard class", () => {
  test("gameboard is able to place ships at specific coordinates by calling the ship class", () => {
    const ship1 = new Ship(5);
    const ship2 = new Ship(3);
    const gameboard = new Gameboard();

    gameboard.placeShip(ship1, 2, 5, "horizontal");
    for (let i = 0; i < ship1.length; i++) {
      expect(gameboard.checkCoordinates(2 + i, 5)).toBe(true);
    }

    gameboard.placeShip(ship2, 0, 0, "vertical");
    for (let i = 0; i < ship2.length; i++) {
      expect(gameboard.checkCoordinates(0, 0 + i)).toBe(true);
    }
  });

  test("gameboard correctly hits a ship at a given coordinate", () => {
    const ship = new Ship(5);
    const gameboard = new Gameboard();

    gameboard.placeShip(ship, 2, 5, "horizontal");
    for (let i = 0; i < ship.length; i++) {
      gameboard.receiveAttack(2 + i, 5);
    }

    expect(ship.isSunk()).toBe(true);
  });

  test("gameboard correcly records the coodinates of a missed shot", () => {
    const gameboard = new Gameboard();

    gameboard.receiveAttack(0, 0);
    expect(gameboard.checkCoordinates(0, 0)).toBe("missed");
  });

  test("gameboard correcly records the coodinates of shots that have been hit", () => {
    const ship = new Ship(5);
    const gameboard = new Gameboard();

    gameboard.placeShip(ship, 0, 0, "horizontal");
    gameboard.receiveAttack(0, 0);
    expect(gameboard.checkCoordinates(0, 0)).toBe("hit");
  });

  test("gameboard is able to report whether or not all of their ships have been sunk.", () => {
    const ship1 = new Ship(5);
    const ship2 = new Ship(3);
    const ship3 = new Ship(4);
    const gameboard = new Gameboard();

    gameboard.placeShip(ship1, 2, 5, "horizontal");
    gameboard.placeShip(ship2, 0, 0, "vertical");
    gameboard.placeShip(ship3, 3, 3, "horizontal");

    for (let i = 0; i < ship1.length; i++) {
      gameboard.receiveAttack(2 + i, 5);
    }

    expect(gameboard.allShipsSunk()).toBe(false);

    for (let i = 0; i < ship2.length; i++) {
      gameboard.receiveAttack(0, 0 + i);
    }

    expect(gameboard.allShipsSunk()).toBe(false);

    for (let i = 0; i < ship3.length; i++) {
      gameboard.receiveAttack(3 + i, 3);
    }

    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
