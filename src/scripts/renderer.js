// module containing functions to help render game components

const NO_OF_ROWS = 10;
const NO_OF_COLS = 10;

// render a DOM element for the gameboard from a passed Player object
function renderGameboard(player) {
  const board = document.createElement("div");
  board.classList.add("board");
  board.dataset.playerName = player.name;

  for (let i = 0; i < NO_OF_ROWS; i++) {
    for (let j = 0; j < NO_OF_COLS; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell", "unattacked");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.dataset.state = "unattacked";
      board.appendChild(cell);
    }
  }

  return board;
}

// renders and returns both players' gameboards
function renderGameboards(player1, player2) {
  const board1 = renderGameboard(player1);
  const board2 = renderGameboard(player2);
  return { board1, board2 };
}

// renders the ships on a gameboard to a gameboard element
function renderShips(gameboard, boardElement) {
  for (let x = 0; x < NO_OF_ROWS; x++) {
    for (let y = 0; y < NO_OF_COLS; y++) {
      if (gameboard.checkCoordinates(x, y) === true) {
        const cell = fetchCell(boardElement, x, y);
        cell.classList.add("ship-location");
      }
    }
  }
}

// removes ships on a passed gameboard element
function removeShips(board) {
  const cells = board.querySelectorAll(".cell");
  for (const cell of cells) {
    cell.classList.remove("ship-location");
  }
}

// updates the classes of a passed cell element based on the passed state
function updateCell(cell, state) {
  cell.classList.remove("unattacked");
  cell.classList.add(state);
  cell.dataset.state = state;
}

// helper function for getting a cell element from a passed board element
function fetchCell(board, row, col) {
  return board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

// renders the win screen that will be utilized at the end of a match
function renderWinScreen() {
  // create overlay element
  const overlay = document.createElement("div");
  overlay.classList.add("win-overlay", "hidden");

  // create a pop up element
  const popup = document.createElement("div");
  popup.classList.add("popup");
  overlay.appendChild(popup);

  // make contents for pop up
  const winTitle = document.createElement("h2");
  winTitle.classList.add("win-title");

  const playAgainBtn = document.createElement("button");
  playAgainBtn.classList.add("play-again-btn");
  playAgainBtn.type = "button";
  playAgainBtn.textContent = "Play Again";

  popup.appendChild(winTitle);
  popup.appendChild(playAgainBtn);

  return overlay;
}

export {
  renderGameboards,
  renderShips,
  removeShips,
  updateCell,
  renderWinScreen,
};
