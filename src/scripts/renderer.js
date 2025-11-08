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

// updates the classes of a passed cell element based on the passed state
function updateCell(cell, state) {
  cell.classList.remove("unattacked");
  cell.classList.add(state);
  cell.dataset.state = state;
}

// renders the win screen at the end of the game given a passed name
function renderWinScreen(name) {
  const body = document.querySelector("body");
  body.innerHTML = `${name} has won!`;
}

export { renderGameboards, updateCell, renderWinScreen };
