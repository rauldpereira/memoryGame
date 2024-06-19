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
const showRankingBtn = document.getElementById("show-ranking-btn");
const endGameButtons = document.getElementById("end-game-buttons");
const homeBtn = document.getElementById("home-btn");
const showRankingBtnEnd = document.getElementById("show-ranking-btn-end");
const modal = document.getElementById("modal");
const rankingListModal = document.getElementById("ranking-list-modal");
const closeModalBtn = document.querySelector(".close-modal-btn");
const completeBtn = document.getElementById("btn-complete");
const title = document.getElementById("title");
const rankings = JSON.parse(localStorage.getItem("rankings")) || [];


let flippedCards = [];
let matchedCards = [];
let attempts = 0;
let timer;
let secondsElapsed = 0;
let isChecking = false;

// Função para embaralhar as cartas
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Função para criar elementos de cartas no tabuleiro
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

// Função para virar uma carta
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

// Função para verificar se as duas cartas viradas formam um par
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

// Função para iniciar o cronômetro
function startTimer() {
  secondsElapsed = 0;
  timerDisplay.innerText = `Tempo: 0s`;
  timer = setInterval(() => {
    secondsElapsed++;
    timerDisplay.innerText = `Tempo: ${secondsElapsed}s`;
  }, 1000);
}

// Função para salvar o ranking do jogador
function saveRanking(username, attempts, time) {
  let newUsername = username;
  let count = 1;

  while (rankings.some((player) => player.username === newUsername)) {
    newUsername = `${username} (${count})`;
    count++;
  }

  rankings.push({ username: newUsername, attempts, time });
  rankings.sort((a, b) => {
    if (a.attempts !== b.attempts) {
      return a.attempts - b.attempts; // Ordena pelo número de tentativas
    } else if (a.time !== b.time) {
      return a.time - b.time; // Se houver empate nas tentativas, ordena pelo tempo
    } else {
      return a.username.localeCompare(b.username); // Em caso de empate em ambas, ordena por ordem alfabética
    }
  });
  localStorage.setItem("rankings", JSON.stringify(rankings));
  displayRanking();
}

// Função para exibir o ranking na página
function displayRanking() {
  const tableBody = document.createElement("tbody");

  rankings.forEach((ranking, index) => {
    const tableRow = document.createElement("tr");

    const rankCell = document.createElement("td");
    rankCell.innerText = `${index + 1}.`;

    const usernameCell = document.createElement("td");
    usernameCell.innerText = ranking.username;

    const attemptsCell = document.createElement("td");
    attemptsCell.innerText = `${ranking.attempts} jogadas`;

    const timeCell = document.createElement("td");
    timeCell.innerText = `${ranking.time} segundos`;

    tableRow.appendChild(rankCell);
    tableRow.appendChild(usernameCell);
    tableRow.appendChild(attemptsCell);
    tableRow.appendChild(timeCell);

    tableBody.appendChild(tableRow);
  });

  const tableElement = document.createElement("table");
  tableElement.innerHTML = `
    <thead>
      <tr>
        <th>Rank</th>
        <th>Nome</th>
        <th>Jogadas</th>
        <th>Tempo</th>
      </tr>
    </thead>
  `;
  tableElement.appendChild(tableBody);

  const existingTable = document.querySelector("#ranking-list-modal table");
  if (existingTable) {
    existingTable.remove();
  }

  rankingListModal.appendChild(tableElement);
}

// Função para encerrar o jogo
function endGame() {
  clearInterval(timer);
  gameBoard.style.display = "none";
  completeBtn.style.display = "none";
  attemptsDisplay.style.display = "none";
  timerDisplay.style.display = "none";
  title.style.display = "block";
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

// Função para lidar com o clique no botão "Início"
function homeBtnClickHandler() {
  userInputContainer.style.display = "flex";
  title.style.display = "block";
  gameBoard.style.display = "none";
  attemptsDisplay.style.display = "none";
  timerDisplay.style.display = "none";
  endGameButtons.style.display = "none";
  message.innerText = "";
}

// Função para exibir o ranking ao clicar no botão "Ranking" no final do jogo
function showRankingBtnEndClickHandler() {
  displayRanking();
  modal.style.display = "block";
}

// Função para iniciar o jogo
function startGame() {
  const username = usernameInput.value.trim();
  if (username) {
    modal.style.display = "none";
    userInputContainer.style.display = "none";
    title.style.display = "none";
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
    displayRanking();
  } else {
    alert("Por favor, digite seu nome.");
  }
}

// Função para reiniciar o jogo
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
  title.style.display = "none";

  gameBoard.style.display = "grid";
  attemptsDisplay.style.display = "block";
  timerDisplay.style.display = "block";
  completeBtn.style.display = "block";
}

// Função para completar o jogo automaticamente
function completeGame() {
  const cardElements = document.querySelectorAll(".card");
  clearInterval(timer);

  cardElements.forEach((cardElement) => {
    cardElement.classList.add("matched");
    cardElement.classList.remove("active");
    cardElement.style.backgroundImage = "none";
    cardElement.style.backgroundColor = "#fff";
  });

  setTimeout(() => {
    matchedCards = cards.map((_, index) => index);
    attemptsDisplay.innerText = `Jogadas: ${attempts}`;
    timerDisplay.innerText = `Tempo: ${secondsElapsed}s`;

    endGame();
  }, 2000);
}

// Adiciona event listeners aos botões
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
showRankingBtn.addEventListener("click", () => {
  displayRanking();
  modal.style.display = "block";
});
completeBtn.addEventListener("click", completeGame);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});
