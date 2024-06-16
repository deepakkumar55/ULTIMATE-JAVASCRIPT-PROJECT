const gameBoard = document.getElementById('game-board');
const timeDisplay = document.getElementById('time');
const movesDisplay = document.getElementById('moves');
const restartButton = document.getElementById('restart');

let cards = [];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let time = 0;
let timer;

const images = [
    '🍎', '🍊', '🍋', '🍉', 
    '🍇', '🍓', '🍒', '🥝',
    '🍎', '🍊', '🍋', '🍉', 
    '🍇', '🍓', '🍒', '🥝'
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initializeGame() {
    gameBoard.innerHTML = '';
    moves = 0;
    time = 0;
    matchedCards = [];
    flippedCards = [];
    clearInterval(timer);
    timeDisplay.textContent = time;
    movesDisplay.textContent = moves;

    shuffle(images);
    cards = images.map(image => createCard(image));
    cards.forEach(card => gameBoard.appendChild(card));
    timer = setInterval(() => {
        time++;
        timeDisplay.textContent = time;
    }, 1000);
}

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = image;
    card.innerHTML = `<span>${image}</span>`;
    card.addEventListener('click', onCardClick);
    return card;
}

function onCardClick(e) {
    const clickedCard = e.currentTarget;

    if (flippedCards.length < 2 && !clickedCard.classList.contains('flipped')) {
        clickedCard.classList.add('flipped');
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.image === card2.dataset.image) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        flippedCards = [];
        
        if (matchedCards.length === cards.length) {
            clearInterval(timer);
            alert(`You won! Time: ${time} seconds, Moves: ${moves}`);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

restartButton.addEventListener('click', initializeGame);

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});
