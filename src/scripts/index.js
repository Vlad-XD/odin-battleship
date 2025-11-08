// import { Player } from "./player.js";
import * as renderer from "./renderer.js";
import * as game from "./game.js";

// variable declarations
const COMPUTER_DELAY = 800; // delay in ms for when computer responds to player attack
const WIN_SCREEN_DELAY = 3000; // delay in ms before transitioning to win screen

const isSinglePlayer = true; // variable that holds a boolean representing whether only one player is playing

// start game and get players
game.initGame("Vlad");
const { player1, player2 } = game.getPlayers();

// render gameboard elements
const { board1, board2 } = renderer.renderGameboards(player1, player2);

const body = document.querySelector("body");
const title1 = document.createElement("h1");
title1.textContent = `${player1.name}`;
const title2 = document.createElement("h1");
title2.textContent = `${player2.name}`;

body.appendChild(title1);
body.appendChild(board1);
body.appendChild(title2);
body.appendChild(board2);

// REMINDER: players click their oppoents boards

// activate player boards
enablePlayerBoards();

// helper function for simulating a computer attack
function makeComputerAttack() {
  const { row, col, result } = game.computerAttack();
  // find cell on board using row and column value
  const cell = board1.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  renderer.updateCell(cell, result);

  // check if game has ended
  if (game.hasEnded()) {
    terminateGame();
  }
}

// function for handling game termination
async function terminateGame() {
  // get winning player
  const winner = game.getWinner();

  // disable boards
  disableBoards();

  // have a brief delay before showing win screen
  await new Promise((resolve) => setTimeout(resolve, 0)); // yield control to allow final render
  await delay(WIN_SCREEN_DELAY);
  renderer.renderWinScreen(winner.name);
}

// helper functions for enabling boards (adding event listeners)
function enablePlayerBoards() {
  // activate opponent board for player
  board2.addEventListener("click", handlePlayer1Click);

  // if multiplayer, activate player board for human opponent
  if (!isSinglePlayer) {
    board1.addEventListener("click", handlePlayer2Click);
  }
}

// helper function for disabling boards
function disableBoards() {
  // disable opponent board
  board2.removeEventListener("click", handlePlayer1Click);

  // if multiplayer, disable player board as well
  if (!isSinglePlayer) {
    board1.removeEventListener("click", handlePlayer2Click);
  }
}

// helper functions for event listeners
async function handlePlayer1Click(e) {
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

    // check if game has ended
    if (game.hasEnded()) {
      terminateGame();
    } else {
      // check if opponent is computer
      if (game.opponentIsComputer) {
        // if so, make the computer attack

        // artifial delay for move to make computer less robotic
        await delay(COMPUTER_DELAY);
        makeComputerAttack();
      }
    }
  }
}

function handlePlayer2Click(e) {
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

    // check if game has ended
    if (game.hasEnded()) {
      terminateGame();
    }
  }
}

// helper function utilized to simulate a delay in gameplay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
