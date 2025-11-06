// module containing the game logic itself
import { Player } from "./player.js";
import { Ship } from "./ship.js";

let player1;
let player2;
let currentPlayer; // currentPlayer holds the player whose turn it currently is;
let opponent; // opponent holds opposite player to currentPlayer
let computer; // computer object used to hold computer logic

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

  // add ships to players
  const ship1 = new Ship(5);
  const ship2 = new Ship(3);
  const ship3 = new Ship(4);
  const gameboards = [player1.gameboard, player2.gameboard];

  for (const gameboard of gameboards) {
    gameboard.placeShip(ship1, 2, 5, "horizontal");
    gameboard.placeShip(ship2, 0, 0, "vertical");
    gameboard.placeShip(ship3, 3, 3, "horizontal");
  }
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

export {
  initGame,
  handleAttack,
  getPlayers,
  opponentIsComputer,
  computerAttack,
};
