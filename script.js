const cards = ['gato.png', 'gato.png', 'girafa.png', 'girafa.png', 'gorila.png', 'gorila.png', 'macaco.png', 'macaco.png', 'porco.png', 'porco.png', 'rato.png', 'rato.png', 'tartaruga.png', 'tartaruga.png', 'vaca.png', 'vaca.png'];
let flippedCards = [];
let matchedCards = [];

const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const message = document.getElementById('message');

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
    const index = cardElement.dataset.index;
    if (!flippedCards.includes(index) && !matchedCards.includes(index)) {
        cardElement.classList.add('active');
        flippedCards.push(index);
        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 500);
        }
    }
}

function checkForMatch() {
    const [firstIndex, secondIndex] = flippedCards;
    const firstCard = document.querySelector(`.card[data-index='${firstIndex}']`);
    const secondCard = document.querySelector(`.card[data-index='${secondIndex}']`);
    if (cards[firstIndex] === cards[secondIndex]) {
        matchedCards.push(firstIndex, secondIndex);
        flippedCards = [];
        if (matchedCards.length === cards.length) {
            message.innerText = 'Congratulations! You found all pairs!';
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('active');
            secondCard.classList.remove('active');
            flippedCards = [];
        }, 500);
    }
}

restartBtn.addEventListener('click', () => {
    flippedCards = [];
    matchedCards = [];
    message.innerText = '';
    shuffle(cards);
    createCardElements();
});

shuffle(cards);
createCardElements();
