const cards = [
  "gato.png",
  "gato.png",
  "girafa.png",
  "girafa.png",
  "gorila.png",
  "gorila.png",
  "macaco.png",
  "macaco.png",
  "porco.png",
  "porco.png",
  "rato.png",
  "rato.png",
  "tartaruga.png",
  "tartaruga.png",
  "vaca.png",
  "vaca.png",
];
const gameBoard = document.getElementById("game-board");
const restartBtn = document.getElementById("restart-btn");
const message = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const usernameInput = document.getElementById("username");
const userInputContainer = document.getElementById("user-input");
const rankingContainer = document.getElementById("ranking");
const rankingList = document.getElementById("ranking-list");
const showRankingBtn = document.getElementById("show-ranking-btn");
const closeRankingBtn = document.getElementById("close-ranking-btn");
const endGameButtons = document.getElementById("end-game-buttons");
const homeBtn = document.getElementById("home-btn");
const showRankingBtnEnd = document.getElementById("show-ranking-btn-end");
const modal = document.getElementById("modal");
const rankingListModal = document.getElementById("ranking-list-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const completeBtn = document.getElementById("btn-complete");
const cardElements = document.querySelectorAll(".card");
const title = document.querySelectorAll(".title");

let flippedCards = [];
let matchedCards = [];
let attempts = 0;
let timer;
let secondsElapsed = 0;
let isChecking = false;
let rankings = JSON.parse(localStorage.getItem("rankings")) || [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createCardElements() {
  gameBoard.innerHTML = "";
  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.index = index;
    const imgElement = document.createElement("img");
    imgElement.src = "img/" + card;
    cardElement.appendChild(imgElement);
    gameBoard.appendChild(cardElement);
    cardElement.addEventListener("click", () => flipCard(cardElement));
  });
}

function flipCard(cardElement) {
  if (
    isChecking ||
    flippedCards.length >= 2 ||
    cardElement.classList.contains("active") ||
    cardElement.classList.contains("matched")
  ) {
    return;
  }
  cardElement.classList.add("active");
  flippedCards.push(cardElement);
  if (flippedCards.length === 2) {
    isChecking = true;
    setTimeout(checkForMatch, 500);
  }
}

function checkForMatch() {
  const [firstCard, secondCard] = flippedCards;
  const firstIndex = firstCard.dataset.index;
  const secondIndex = secondCard.dataset.index;

  attempts++;
  attemptsDisplay.innerText = `Jogadas: ${attempts}`;

  if (cards[firstIndex] === cards[secondIndex]) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedCards.push(firstIndex, secondIndex);
    flippedCards = [];
    if (matchedCards.length === cards.length) {
      endGame();
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("active");
      secondCard.classList.remove("active");
      flippedCards = [];
    }, 500);
  }
  isChecking = false;
}

function startTimer() {
  secondsElapsed = 0;
  timerDisplay.innerText = `Tempo: 0s`;
  timer = setInterval(() => {
    secondsElapsed++;
    timerDisplay.innerText = `Tempo: ${secondsElapsed}s`;
  }, 1000);
}

function saveRanking(username, attempts, time) {
  let newUsername = username;
  let count = 1;

  while (rankings.some((player) => player.username === newUsername)) {
    newUsername = `${username} (${count})`;
    count++;
  }

  rankings.push({ username: newUsername, attempts, time });
  rankings.sort((a, b) => a.attempts - b.attempts || a.time - b.time);
  localStorage.setItem("rankings", JSON.stringify(rankings));
  displayRanking();
}

function displayRanking() {
  rankingListModal.innerHTML = "";

  for (let i = 0; i < rankings.length; i++) {
    const ranking = rankings[i];

    const listItemModal = document.createElement("li");
    listItemModal.innerText = `${i + 1}. ${ranking.username} - ${ranking.attempts} jogadas, ${ranking.time} segundos`;
    rankingListModal.appendChild(listItemModal);
  }
}

function endGame() {
  clearInterval(timer);
  gameBoard.style.display = "none";
  completeBtn.style.display = "none";
  attemptsDisplay.style.display = "none";
  timerDisplay.style.display = "none";
  message.innerText = `Parabéns, ${usernameInput.value}! Todos os pares foram encontrados em ${attempts} Jogadas e ${secondsElapsed} segundos!`;
  saveRanking(usernameInput.value, attempts, secondsElapsed);
  endGameButtons.style.display = "block";
  homeBtn.addEventListener("click", homeBtnClickHandler);
  showRankingBtnEnd.addEventListener("click", showRankingBtnEndClickHandler);

  flippedCards = [];
  matchedCards = [];
  attempts = 0;
  timer = null;
  secondsElapsed = 0;
}

function homeBtnClickHandler() {
  userInputContainer.style.display = "block";
  gameBoard.style.display = "none";
  attemptsDisplay.style.display = "none";
  timerDisplay.style.display = "none";
  endGameButtons.style.display = "none";
  message.innerText = "";
}

function showRankingBtnEndClickHandler() {
  displayRanking();
  modal.style.display = "block";
}

function startGame() {
  const username = usernameInput.value.trim();
  if (username) {
    if (modal.style.display === "block") {
      modal.style.display = "none";
    }
    userInputContainer.style.display = "none";
    gameBoard.style.display = "grid";
    restartBtn.style.display = "inline-block";
    attemptsDisplay.style.display = "block";
    timerDisplay.style.display = "block";
    endGameButtons.style.display = "none";
    message.innerText = "";
    attempts = 0;
    attemptsDisplay.innerText = "Jogadas: 0";
    secondsElapsed = 0;
    timerDisplay.innerText = "Tempo: 0s";
    completeBtn.style.display = "block";

    shuffle(cards);
    createCardElements();
    startTimer();
  } else {
    alert("Por favor, digite seu nome.");
  }
}

function restartGame() {
  homeBtn.removeEventListener("click", homeBtnClickHandler);
  showRankingBtnEnd.removeEventListener("click", showRankingBtnEndClickHandler);

  clearInterval(timer);
  flippedCards = [];
  matchedCards = [];
  attempts = 0;
  isChecking = false;
  secondsElapsed = 0;
  timer = null;

  message.innerText = "";
  attemptsDisplay.innerText = "Jogadas: 0";
  timerDisplay.innerText = "Tempo: 0s";
  shuffle(cards);
  createCardElements();
  startTimer();
  endGameButtons.style.display = "none";
  modal.style.display = "none";

  gameBoard.style.display = "grid";
  attemptsDisplay.style.display = "block";
  timerDisplay.style.display = "block";
  restartBtn.style.display = "block";
  completeBtn.style.display = "block";
}

function completeGame() {
  cardElements.forEach((cardElement, index) => {
    cardElement.classList.add("matched");
  });

  matchedCards = cards.map((_, index) => index);
  attempts = 0;
  attemptsDisplay.innerText = `Jogadas: ${attempts}`;
  secondsElapsed++;
  timerDisplay.innerText = `Tempo: ${secondsElapsed}s`;

  endGame();
}

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", restartGame);

showRankingBtn.addEventListener("click", () => {
  displayRanking();
  modal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

completeBtn.addEventListener("click", completeGame);
