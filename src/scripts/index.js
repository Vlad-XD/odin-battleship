// import { Player } from "./player.js";
import * as renderer from "./renderer.js";
import * as game from "./game.js";

// start game and get players
game.initGame("Vlad", "John");
const { player1, player2 } = game.getPlayers();

const body = document.querySelector("body");
const title1 = document.createElement("h1");
title1.textContent = `${player1.name}`;
const title2 = document.createElement("h1");
title2.textContent = `${player2.name}`;
const board1 = renderer.renderGameboard(player1);
const board2 = renderer.renderGameboard(player2);
body.appendChild(title1);
body.appendChild(board1);
body.appendChild(title2);
body.appendChild(board2);

// REMINDER: players click their oppoents boards

// check for attack position by finding nearest cell that was clicked within the board element
board1.addEventListener("click", (e) => {
  // Find the closest cell (closest element with data-row and data-col );
  const cell = e.target.closest("[data-row][data-col]");

  // ignore clicks if not on a cell
  if (!cell) return;

  // Extract coordinates of cell
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);

  // call attack function
  const result = game.handleAttack(player2, row, col);

  // if attack was successful, render cell with new state
  if (result) {
    renderer.updateCell(cell, result);
  }
});

board2.addEventListener("click", (e) => {
  // Find the closest cell (closest element with data-row and data-col );
  const cell = e.target.closest("[data-row][data-col]");

  // ignore clicks if not on a cell
  if (!cell) return;

  // Extract coordinates of cell
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);

  // call attack function
  const result = game.handleAttack(player1, row, col);

  // if attack was successful, render cell with new state
  if (result) {
    renderer.updateCell(cell, result);
  }
});
