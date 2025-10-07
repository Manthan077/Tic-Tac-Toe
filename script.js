let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let player1 = "";
let player2 = "";
let mode = ""; // "1p" or "2p"
let gameActive = false;

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const modeSelect = document.getElementById("mode-select");
const playerSetup = document.getElementById("player-setup");
const gameBoard = document.getElementById("game-board");
const feedback = document.getElementById("feedback");

document.getElementById("onePlayer").addEventListener("click", () => setMode("1p"));
document.getElementById("twoPlayers").addEventListener("click", () => setMode("2p"));
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

function setMode(selectedMode) {
  mode = selectedMode;
  modeSelect.classList.add("hidden");
  playerSetup.classList.remove("hidden");
  if (mode === "1p") {
    document.getElementById("player2").value = "AI 🤖";
    document.getElementById("player2").disabled = true;
  } else {
    document.getElementById("player2").value = "";
    document.getElementById("player2").disabled = false;
  }
}

function startGame() {
  player1 = document.getElementById("player1").value.trim() || "Player 1";
  player2 = document.getElementById("player2").value.trim() || (mode === "1p" ? "AI 🤖" : "Player 2");

  playerSetup.classList.add("hidden");
  gameBoard.classList.remove("hidden");
  feedback.classList.add("hidden");

  statusText.textContent = `${player1}'s turn (X)`;
  gameActive = true;

  cells.forEach(cell => {
    cell.addEventListener("click", cellClick);
    cell.textContent = "";
    cell.classList.remove("taken");
  });
}

function cellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.style.color = currentPlayer === "X" ? "red" : "blue";
  e.target.classList.add("taken");

  if (checkWin()) {
    const winner = currentPlayer === "X" ? player1 : player2;
    statusText.textContent = `${winner} wins! 🎉`;
    showFeedback(winner);
    endGame();
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a tie! 🤝";
    showFeedback("tie");
    endGame();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (mode === "1p" && currentPlayer === "O") {
    statusText.textContent = `${player2}'s turn...`;
    setTimeout(computerMove, 600);
  } else {
    statusText.textContent = `${currentPlayer === "X" ? player1 : player2}'s turn (${currentPlayer})`;
  }
}

function computerMove() {
  let move = findBestMove() ?? getRandomMove();
  board[move] = "O";
  const cell = cells[move];
  cell.textContent = "O";
  cell.style.color = "blue";
  cell.classList.add("taken");

  if (checkWin()) {
    statusText.textContent = `${player2} wins! 🤖`;
    showFeedback("ai");
    endGame();
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a tie! 🤝";
    showFeedback("tie");
    endGame();
    return;
  }

  currentPlayer = "X";
  statusText.textContent = `${player1}'s turn (X)`;
}

function findBestMove() {
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      if (checkWin()) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }
  // Try to block
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "X";
      if (checkWin()) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }
  return null;
}

function getRandomMove() {
  const emptyIndices = board.map((val, i) => (val === "" ? i : null)).filter(v => v !== null);
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function checkWin() {
  const combos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return combos.some(combo => combo.every(i => board[i] === currentPlayer));
}

function endGame() {
  gameActive = false;
  cells.forEach(cell => cell.removeEventListener("click", cellClick));
}

function showFeedback(result) {
  feedback.classList.remove("hidden");

  if (result === "tie") {
    feedback.innerHTML = "🤝 It’s a draw — evenly matched minds!";
  } else if (result === "ai") {
    feedback.innerHTML = "🤖 The AI outsmarted you this time... Try again!";
  } else if (result === player1) {
    feedback.innerHTML = "🏆 You crushed the AI! Well played!";
  } else {
    feedback.innerHTML = `🎉 ${result} wins! Fantastic game!`;
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  feedback.classList.add("hidden");
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken");
    cell.addEventListener("click", cellClick);
  });
  statusText.textContent = `${player1}'s turn (X)`;
}
