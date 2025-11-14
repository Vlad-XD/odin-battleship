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

// renders gameboard container containing initial gameboards and player titles
function renderGameContainer(player1, player2) {
  const { board1, board2 } = renderGameboards(player1, player2);

  const title1 = document.createElement("h1");
  title1.classList.add("player-title");
  title1.textContent = `${player1.name}`;
  const title2 = document.createElement("h1");
  title2.classList.add("player-title");
  title2.textContent = `${player2.name}`;

  const gameContainer = document.createElement("div");
  gameContainer.classList.add("game-container");

  const boardContainer1 = document.createElement("div");
  boardContainer1.classList.add(
    "board-container",
    "board1-container",
    "player-container",
  );

  const boardContainer2 = document.createElement("div");
  boardContainer2.classList.add(
    "board-container",
    "board2-container",
    "opponent-container",
  );

  boardContainer1.appendChild(title1);
  boardContainer1.appendChild(board1);
  boardContainer2.appendChild(title2);
  boardContainer2.appendChild(board2);

  gameContainer.appendChild(boardContainer1);
  gameContainer.appendChild(boardContainer2);

  return gameContainer;
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

// renders the buttons utilized when placing ships/selecting ship locations
function renderShipSelectionButtons() {
  const selectionBtn = document.createElement("button");
  selectionBtn.classList.add("place-btn");
  selectionBtn.textContent = "Shuffle Ships";

  const confirmationBtn = document.createElement("button");
  confirmationBtn.classList.add("place-btn");
  confirmationBtn.textContent = "Place Ships";

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("place-btn-container");

  buttonContainer.appendChild(selectionBtn);
  buttonContainer.appendChild(confirmationBtn);

  return { buttonContainer, selectionBtn, confirmationBtn };
}

export {
  renderGameboards,
  renderGameContainer,
  renderShips,
  removeShips,
  updateCell,
  renderWinScreen,
  renderShipSelectionButtons,
};
