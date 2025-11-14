// import { Player } from "./player.js";
import * as renderer from "./renderer.js";
import * as game from "./game.js";

// variable declarations
const COMPUTER_DELAY = 800; // delay in ms for when computer responds to player attack
const WIN_SCREEN_DELAY = 3000; // delay in ms before transitioning to win screen

const SHIPS = {
  // ship types and sizes
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
};

const body = document.querySelector("body");

let isSinglePlayer;
let player1;
let player2;
let board1;
let board2;

// begin at title screen
initiateTitleScreen();

// function to handle title screen functionality
function initiateTitleScreen() {
  // find title screen buttons and attach event handlers
  const singlePlayerBtn = document.querySelector("button.single-player-btn");
  singlePlayerBtn.addEventListener("click", () => {
    // clear title screen
    body.innerHTML = "";

    // start single player game
    startSinglePlayerGame();
  });
}

// helper function for starting single player game
async function startSinglePlayerGame() {
  // set up win screen
  setUpWinScreen();

  isSinglePlayer = true; // variable that holds a boolean representing whether only one player is playing

  // start game and get players
  game.initGame("Player 1");
  ({ player1, player2 } = game.getPlayers());

  // render gameboard elements
  const gameContainer = renderer.renderGameContainer(player1, player2);
  board1 = gameContainer.querySelector(".board1-container");
  board2 = gameContainer.querySelector(".board2-container");

  // add elements to DOM
  body.appendChild(gameContainer);

  // place player ships
  await waitForShipPlacements();

  // activate player boards
  enablePlayerBoards();
}

// function to handle waiting for ship placement
async function waitForShipPlacements() {
  // generate and render initial ship location
  generateRandomPlayerShips(player1);
  renderer.renderShips(player1.gameboard, board1);

  // add buttons for ship shuffle and confirmation
  const { selectionBtn, confirmationBtn } = addShipSelectionButtons();
  attachShipSelectionHandling(selectionBtn, player1, board1);

  // wait for player to select ships
  await waitForPlayer1ToPlaceShips(selectionBtn, confirmationBtn);

  // if single player, generate ships for computer
  if (isSinglePlayer) {
    generateRandomPlayerShips(player2);
  }
}

// helper function for placing ships for players at a random location
function generateRandomPlayerShips(player) {
  // reset player board
  player.gameboard.reset();

  for (const length of Object.values(SHIPS)) {
    game.placeRandomShip(player, length);
  }
}

// helper function for adding ship selection buttons
// returns two buttons, one for random selection and one for confirmation
function addShipSelectionButtons() {
  const { buttonContainer, selectionBtn, confirmationBtn } =
    renderer.renderShipSelectionButtons();

  body.appendChild(buttonContainer);

  return { selectionBtn, confirmationBtn };
}

// helper function for attaching ship selection functionality
function attachShipSelectionHandling(button, player, board) {
  button.addEventListener("click", () => {
    renderer.removeShips(board);
    generateRandomPlayerShips(player);
    renderer.renderShips(player.gameboard, board);
  });
}

// helper function for adding functionality to ship selection buttons
// returns a promise utilized to wait for player selection;
function waitForPlayer1ToPlaceShips(selectionBtn, confirmationBtn) {
  return new Promise((resolve) => {
    function handleDoneClick() {
      selectionBtn.remove();
      confirmationBtn.remove();
      resolve();
    }

    confirmationBtn.addEventListener("click", handleDoneClick);
  });
}

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
  showWinScreen(winner.name);
}

// helper functions for enabling boards (adding event listeners)
function enablePlayerBoards() {
  // activate opponent board for player
  board2.addEventListener("click", handlePlayer1Click);

  // if multiplayer, activate player board for human opponent
  if (!isSinglePlayer) {
    board1.addEventListener("click", handlePlayer2Click);
  }

  // mark game container as active through a class
  const gameContainer = body.querySelector(".game-container");
  gameContainer.classList.add("boards-active");
}

// helper function for disabling boards
function disableBoards() {
  // disable opponent board
  board2.removeEventListener("click", handlePlayer1Click);

  // if multiplayer, disable player board as well
  if (!isSinglePlayer) {
    board1.removeEventListener("click", handlePlayer2Click);
  }

  //  remove active class from game container
  const gameContainer = body.querySelector(".game-container");
  gameContainer.classList.remove("boards-active");
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

// helper function for setting up win screen
function setUpWinScreen() {
  const winScreen = renderer.renderWinScreen();
  body.appendChild(winScreen);

  const playAgainBtn = winScreen.querySelector(".play-again-btn");
  playAgainBtn.addEventListener("click", handlePlayAgain);
}

// helper function for activating win screen
function showWinScreen(name) {
  const winScreen = body.querySelector(".win-overlay");

  const winTitle = winScreen.querySelector(".win-title");
  winTitle.textContent = `${name} Wins!`;
  winScreen.classList.remove("hidden");
}

// helper function for hiding win screen
function hideWinScreen() {
  const winScreen = body.querySelector(".win-overlay");
  winScreen.classList.add("hidden");
}

// helper function for helping restart a single player game
async function restartSinglePlayerGame() {
  // reset game
  game.resetGame();

  // render gameboard elements
  const { board1: newBoard1, board2: newBoard2 } = renderer.renderGameboards(
    player1,
    player2,
  );
  board1.replaceWith(newBoard1);
  board2.replaceWith(newBoard2);
  board1 = newBoard1;
  board2 = newBoard2;

  // place player ships
  await waitForShipPlacements();

  // activate player boards
  enablePlayerBoards();
}

// helper function for play again putton functionality
async function handlePlayAgain() {
  // hide win screen
  hideWinScreen();

  // check if single player game is being player
  if (isSinglePlayer) {
    await restartSinglePlayerGame();
  }
}
