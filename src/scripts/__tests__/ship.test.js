import { Ship } from "../ship.js";

describe("Ship class", () => {
  test("the length property is properly readable", () => {
    const ship1 = new Ship(1);
    const ship2 = new Ship(5);
    const ship3 = new Ship(12);

    expect(ship1.length).toBe(1);
    expect(ship2.length).toBe(5);
    expect(ship3.length).toBe(12);
  });

  test("ship registers a hit when attacked", () => {
    const ship = new Ship(5);

    for (let i = 0; i < ship.length; i++) {
      ship.hit();
    }

    expect(ship.isSunk()).toBe(true);
  });

  test("ship sinks after receiving damage equal to its length", () => {
    const ship = new Ship(5);

    expect(ship.isSunk()).toBe(false);

    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(false);

    ship.hit();
    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(true);
  });
});
