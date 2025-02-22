const boardState = Array(9).fill(null); // Initialize board state with null values
const cells = document.querySelectorAll(".cell"); // Get all cell elements
let currentPlayer = "X"; // Start with player X
let message = document.getElementById("winner-message"); // Get the winner message element
let reset = document.getElementById("reset-button"); // Get the reset button element

// Define all possible winning combinations
const winningCombinations = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

// Add event listener to the reset button
reset.addEventListener("click", function () {
  // Reset the board state
  boardState.fill(null);

  // Clear the text content of all cells
  cells.forEach(function (cell) {
    cell.textContent = "";
  });

  // Reset the current player to X
  currentPlayer = "X";

  // Clear the winner message
  message.textContent = "";

  // Re-enable pointer events for all cells
  cells.forEach((cell) => (cell.style.pointerEvents = "auto"));
});

// Function to check if the current player has won
function checkWins(boardState, player) {
  return winningCombinations.some((combination) => {
    return combination.every((index) => boardState[index] === player);
  });
}

// Add event listeners to all cells
cells.forEach(function (cell) {
  cell.addEventListener("click", function () {
    const cellId = parseInt(cell.id) - 1; // Get the cell index (0-8)

    // Check if the cell is empty
    if (!boardState[cellId]) {
      // Update the board state and cell text
      boardState[cellId] = currentPlayer;
      cell.textContent = currentPlayer;

      // Check if the current player has won
      if (checkWins(boardState, currentPlayer)) {
        message.textContent = `${currentPlayer} wins!`; // Display winner message
        alert(`${currentPlayer} wins!`);

        // Disable further moves after the game ends
        cells.forEach((cell) => (cell.style.pointerEvents = "none"));
        return;
      }

      // Check if the game is a draw
      if (!boardState.includes(null)) {
        message.textContent = "It's a draw!"; // Display draw message
        alert("It's a draw!");

        // Disable further moves after the game ends
        cells.forEach((cell) => (cell.style.pointerEvents = "none"));
        return;
      }

      // Switch to the other player
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  });
});