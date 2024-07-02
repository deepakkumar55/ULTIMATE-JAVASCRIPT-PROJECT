const cells = document.querySelectorAll('.cell');
const playerText = document.querySelector('.player');
const resetButton = document.querySelector('.reset');
const message = document.querySelector('.message');

let currentPlayer = 'X';
let gameOver = false;
let board = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5], 
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (!gameOver && board[index] === '') {
      board[index] = currentPlayer;
      cell.textContent = currentPlayer;
      checkWin();
      togglePlayer();
    }
  });
});

resetButton.addEventListener('click', resetGame);

function togglePlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  playerText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      message.textContent = `Player ${currentPlayer} wins!`;
      gameOver = true;
      break;
    }
  }

  if (!board.includes('') && !gameOver) {
    message.textContent = "It's a tie!";
    gameOver = true;
  }
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => cell.textContent = '');
  currentPlayer = 'X';
  playerText.textContent = `Player X's turn`;
  message.textContent = '';
  gameOver = false;
}