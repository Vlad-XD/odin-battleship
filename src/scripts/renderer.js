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

// updates the classes of a passed cell element based on the passed state
function updateCell(cell, state) {
  cell.classList.remove("unattacked");
  cell.classList.add(state);
  cell.dataset.state = state;
}

export { renderGameboard, updateCell };
