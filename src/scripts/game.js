// module containing the game logic itself
import { Gameboard } from "./gameboard.js";
import { Player } from "./player.js";
import { Ship } from "./ship.js";

// variable declarations
let player1;
let player2;
let currentPlayer; // currentPlayer holds the player whose turn it currently is;
let opponent; // opponent holds opposite player to currentPlayer
let computer = null; // computer object used to hold computer logic
let winner = null; // holds the player who won the game

function initGame(player1Name, player2Name = null) {
  player1 = new Player(player1Name);

  // if player2Name = null, player 2 is a computer
  if (player2Name === null) {
    player2 = new Player("Computer", true);
    computer = new Computer();
  } else {
    player2 = new Player(player2Name);
  }

  // player 1 always starts the game
  currentPlayer = player1;
  opponent = player2;
}

// places a ship of the passed length a the given coordinate for the passed player
function placeShip(player, shipLength, x, y, orientation) {
  const result = player.gameboard.placeShip(
    new Ship(shipLength),
    x,
    y,
    orientation,
  );
  return result;
}

// places a ship at a valid random coordinate and at a random orientation
function placeRandomShip(player, shipLength) {
  const ROWS = 10;
  const COLS = 10;
  let result; //holds result of placeShip, indicating if a ship wwas place sucessfully

  do {
    const orientation =
      Math.random() < 0.5
        ? Gameboard.ORIENTATIONS.horizontal
        : Gameboard.ORIENTATIONS.vertical;

    // generate random location based on ship length and orientation
    if (orientation === Gameboard.ORIENTATIONS.vertical) {
      const x = Math.floor(Math.random() * ROWS);
      const y = Math.floor(Math.random() * (COLS - shipLength + 1));
      result = placeShip(player, shipLength, x, y, orientation);
    }

    if (orientation === Gameboard.ORIENTATIONS.horizontal) {
      const y = Math.floor(Math.random() * (ROWS - shipLength + 1));
      const x = Math.floor(Math.random() * COLS);
      result = placeShip(player, shipLength, x, y, orientation);
    }
  } while (result === false);
}

// called by board DOM element to handle player attacks
function handleAttack(player, row, col) {
  // check if player calling the attack is current player
  if (player.name !== currentPlayer.name) {
    return false;
  }

  // check if location clicked is a valid location
  const cellState = opponent.gameboard.checkCoordinates(row, col);
  if (cellState === "missed" || cellState === "hit") {
    return false;
  }

  // otherwise, attack the cell
  opponent.gameboard.receiveAttack(row, col);

  // check for win condition
  if (checkWinner() === true) {
    winner = currentPlayer;
  }

  // get results
  const result = opponent.gameboard.checkCoordinates(row, col);

  // swap player turns
  swapTurn();

  // return result back to caller
  return result;
}

// helper function for swapping player turns
function swapTurn() {
  const prevPlayer = currentPlayer;
  currentPlayer = opponent;
  opponent = prevPlayer;
}

// returns initiated players
function getPlayers() {
  return { player1, player2 };
}

// helper class for generating computer logic
class Computer {
  #rows = 10;
  #cols = 10;
  #validMoves = []; // array holding objects describing every possible valid move

  constructor() {
    // generate valid moves
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#cols; j++) {
        this.#validMoves.push({ row: i, col: j });
      }
    }
  }

  // returns a random move from valid moves avaliable
  getMove() {
    const randomIndex = Math.floor(Math.random() * this.#validMoves.length);
    const [move] = this.#validMoves.splice(randomIndex, 1);
    return move;
  }
}

// returns true if player is facing a computer opponent
function opponentIsComputer() {
  return player2.isComputer;
}

// function that handles computer attack logic when called
function computerAttack() {
  // get move from computer
  const { row, col } = computer.getMove();
  // get cell from row and col

  // call attack function
  const result = handleAttack(player2, row, col);
  // return result
  return { row, col, result };
}

// return true if all of the opponent's ships have been sunk
function checkWinner() {
  return opponent.gameboard.allShipsSunk();
}

// return true if game has ended (winner has been determined)
function hasEnded() {
  return winner === null ? false : true;
}

// function that returns winner of game
function getWinner() {
  return winner;
}

// function for resetting game with current conditions (i.e., same players and mode)
function resetGame() {
  // reset gameboards
  player1.gameboard.reset();
  player2.gameboard.reset();

  // reset intial conditions
  currentPlayer = player1;
  opponent = player2;
  winner = null;

  // if computer was being used, reset computer object
  if (computer !== null) {
    computer = new Computer();
  }
}

export {
  initGame,
  placeRandomShip,
  handleAttack,
  getPlayers,
  opponentIsComputer,
  computerAttack,
  hasEnded,
  getWinner,
  resetGame,
};
