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

  test("gameboard does not place a ship with invalid coordinate/length/orientation combinations", () => {
    const shipLength = 5;
    const ship1 = new Ship(shipLength);
    const ship2 = new Ship(shipLength);
    const gameboard = new Gameboard();

    gameboard.placeShip(ship1, 6, 1, "horizontal");
    expect(gameboard.checkCoordinates(6, 1)).toBe(false);

    gameboard.placeShip(ship2, 1, 6, "vertical");
    expect(gameboard.checkCoordinates(1, 6)).toBe(false);
  });

  test("placeShip returns true if a ship location is valid and false if invalid", () => {
    const shipLength = 5;
    const ship1 = new Ship(shipLength);
    const ship2 = new Ship(shipLength);
    const gameboard = new Gameboard();

    expect(gameboard.placeShip(ship1, 6, 1, "horizontal")).toBe(false);
    expect(gameboard.placeShip(ship1, 5, 1, "horizontal")).toBe(true);

    expect(gameboard.placeShip(ship2, 1, 6, "vertical")).toBe(false);
    expect(gameboard.placeShip(ship2, 1, 5, "vertical")).toBe(true);
  });

  test("placeShip does not place a ship if there are any ships placed in the corresponding coordinates", () => {
    const shipLength = 5;
    const ship1 = new Ship(shipLength);
    const ship2 = new Ship(shipLength);
    const ship3 = new Ship(shipLength);
    const gameboard = new Gameboard();

    gameboard.placeShip(ship1, 5, 4, "horizontal");

    expect(gameboard.placeShip(ship2, 7, 0, "vertical")).toBe(false);
    expect(gameboard.placeShip(ship3, 3, 4, "horizontal")).toBe(false);
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

  test("reset method properly resets the state of the gameboard", () => {
    const ROWS = 10;
    const COLS = 10;
    const ship1 = new Ship(5);
    const ship2 = new Ship(3);
    const ship3 = new Ship(4);
    const gameboard = new Gameboard();

    gameboard.placeShip(ship1, 2, 5, "horizontal");
    gameboard.placeShip(ship2, 0, 0, "vertical");
    gameboard.placeShip(ship3, 3, 3, "horizontal");

    // at this point, ships have been placed and no ships have been sunk

    gameboard.reset();

    // we should expect no ships to be found
    for (let x = 0; x < ROWS; x++) {
      for (let y = 0; y < COLS; y++) {
        expect(gameboard.checkCoordinates(x, y)).toBe(false);
      }
    }

    // if we add one ship and sink it, we should expect all ships to be sunk
    gameboard.placeShip(ship1, 2, 5, "horizontal");
    for (let i = 0; i < ship1.length; i++) {
      gameboard.receiveAttack(2 + i, 5);
    }
    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
