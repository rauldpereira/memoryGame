const cards = ['gato.png', 'gato.png', 'girafa.png', 'girafa.png', 'gorila.png', 'gorila.png', 'macaco.png', 'macaco.png', 'porco.png', 'porco.png', 'rato.png', 'rato.png', 'tartaruga.png', 'tartaruga.png', 'vaca.png', 'vaca.png'];
const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const usernameInput = document.getElementById('username');
const userInputContainer = document.getElementById('user-input');
const rankingContainer = document.getElementById('ranking');
const rankingList = document.getElementById('ranking-list');
const showRankingBtn = document.getElementById('show-ranking-btn');
const closeRankingBtn = document.getElementById('close-ranking-btn');
const endGameButtons = document.getElementById('end-game-buttons');
const homeBtn = document.getElementById('home-btn');
const showRankingBtnEnd = document.getElementById('show-ranking-btn-end');

let flippedCards = [];
let matchedCards = [];
let attempts = 0;
let timer;
let secondsElapsed = 0;
let isChecking = false;
let rankings = JSON.parse(localStorage.getItem('rankings')) || [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCardElements() {
    gameBoard.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        const imgElement = document.createElement('img');
        imgElement.src = 'img/' + card;
        cardElement.appendChild(imgElement);
        gameBoard.appendChild(cardElement);
        cardElement.addEventListener('click', () => flipCard(cardElement));
    });
}

function flipCard(cardElement) {
    if (isChecking || flippedCards.length >= 2 || cardElement.classList.contains('active') || cardElement.classList.contains('matched')) {
        return;
    }
    cardElement.classList.add('active');
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
    attemptsDisplay.innerText = `Tentativas: ${attempts}`;

    if (cards[firstIndex] === cards[secondIndex]) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedCards.push(firstIndex, secondIndex);
        flippedCards = [];
        if (matchedCards.length === cards.length) {
            endGame();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('active');
            secondCard.classList.remove('active');
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
    rankings.push({ username, attempts, time });
    rankings.sort((a, b) => a.attempts - b.attempts || a.time - b.time);
    localStorage.setItem('rankings', JSON.stringify(rankings));
    displayRanking();
}

function displayRanking() {
    rankingList.innerHTML = '';
    rankings.forEach((ranking, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = `${index + 1}. ${ranking.username} - ${ranking.attempts} tentativas, ${ranking.time} segundos`;
        rankingList.appendChild(listItem);
    });
}

function endGame() {
    clearInterval(timer);
    message.innerText = `Parabéns, ${usernameInput.value}! Todos os pares foram encontrados em ${attempts} tentativas e ${secondsElapsed} segundos!`;
    saveRanking(usernameInput.value, attempts, secondsElapsed);
    endGameButtons.style.display = 'block';
    homeBtn.addEventListener('click', homeBtnClickHandler);
    showRankingBtnEnd.addEventListener('click', showRankingBtnEndClickHandler);
}

function homeBtnClickHandler() {
    userInputContainer.style.display = 'block';
    gameBoard.style.display = 'none';
    restartBtn.style.display = 'none';
    attemptsDisplay.style.display = 'none';
    timerDisplay.style.display = 'none';
    endGameButtons.style.display = 'none';
    message.innerText = '';
}

function showRankingBtnEndClickHandler() {
    displayRanking();
    rankingContainer.style.display = 'block';
}

startBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        if (rankingContainer.style.display === 'block') {
            rankingContainer.style.display = 'none';
        }
        userInputContainer.style.display = 'none';
        gameBoard.style.display = 'grid';
        restartBtn.style.display = 'inline-block';
        attemptsDisplay.style.display = 'block';
        timerDisplay.style.display = 'block';
        endGameButtons.style.display = 'none';
        message.innerText = '';
        attempts = 0;
        attemptsDisplay.innerText = 'Tentativas: 0';
        secondsElapsed = 0;
        timerDisplay.innerText = 'Tempo: 0s';
        shuffle(cards);
        createCardElements();
        startTimer();
    } else {
        alert('Por favor, digite seu nome.');
    }
});

restartBtn.addEventListener('click', () => {
    flippedCards = [];
    matchedCards = [];
    attempts = 0;
    isChecking = false;
    clearInterval(timer);
    message.innerText = '';
    attemptsDisplay.innerText = 'Tentativas: 0';
    timerDisplay.innerText = 'Tempo: 0s';
    shuffle(cards);
    createCardElements();
    startTimer();
    endGameButtons.style.display = 'none';
});

showRankingBtn.addEventListener('click', () => {
    displayRanking();
    rankingContainer.style.display = 'block';
});

closeRankingBtn.addEventListener('click', () => {
    rankingContainer.style.display = 'none';
});

displayRanking();
