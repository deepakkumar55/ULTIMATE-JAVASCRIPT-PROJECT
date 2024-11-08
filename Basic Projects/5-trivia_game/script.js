let score = 0;
let currentQuestionIndex = 0;
let questions = [];
let timerInterval;
let timeRemaining = 10;

const startButton = document.getElementById('start-button');
const nextButtonContainer = document.getElementById('next-button-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedback = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const questionContainer = document.getElementById('question-container');
const answerButtons = document.getElementById('answer-buttons');
const timerElement = document.getElementById('timer');
const finalScore = document.getElementById('final-score');
const gameOverContainer = document.getElementById('game-over-container');
const gameContainer = document.getElementById('game-container');
const startContainer = document.getElementById('start-container');
const restartButton = document.getElementById('restart-button');
const loadingIndicator = document.getElementById('loading');

// Start game
startButton.onclick = startGame;

function startGame() {
  startContainer.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  fetchTriviaQuestions();
  loadingIndicator.classList.remove('hidden');  // Show loading
}

// Fetch trivia questions from the API
function fetchTriviaQuestions() {
  fetch('https://opentdb.com/api.php?amount=50')  // Limited to 10 for simplicity
    .then(response => response.json())
    .then(data => {
      questions = data.results;
      loadingIndicator.classList.add('hidden');  // Hide loading
      displayQuestion();
    })
    .catch(error => console.error('Error fetching trivia questions:', error));
}

// Display the current question and answers
function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  const questionText = currentQuestion.question;
  const category = currentQuestion.category;
  const difficulty = currentQuestion.difficulty;
  const correctAnswer = currentQuestion.correct_answer;
  const incorrectAnswers = currentQuestion.incorrect_answers;

  // Display the question and other details
  questionContainer.innerHTML = `
    <p id="question">${decodeHTML(questionText)}</p>
    <p id="category">Category: ${decodeHTML(category)}</p>
    <p id="difficulty">Difficulty: ${difficulty}</p>
  `;
  
  // Prepare the answers
  const allAnswers = [...incorrectAnswers, correctAnswer];
  allAnswers.sort(() => Math.random() - 0.5);

  // Clear previous answers
  answerButtons.innerHTML = '';

  // Add answer buttons dynamically
  allAnswers.forEach(answer => {
    const button = document.createElement('button');
    button.innerHTML = decodeHTML(answer);
    button.onclick = () => handleAnswer(answer, correctAnswer);
    answerButtons.appendChild(button);
  });

  // Start the timer
  startTimer();
}

// Handle answer click
function handleAnswer(answer, correctAnswer) {
  clearInterval(timerInterval);

  // Provide feedback
  if (answer === correctAnswer) {
    score++;
    feedback.innerHTML = 'Correct!';
    feedbackContainer.classList.remove('hidden');
  } else {
    feedback.innerHTML = 'Incorrect!';
    feedbackContainer.classList.remove('hidden');
  }

  // Disable all buttons after an answer is selected
  Array.from(answerButtons.children).forEach(button => button.disabled = true);
  
  // Show the next button
  nextButtonContainer.classList.remove('hidden');
}

// Timer functionality
function startTimer() {
  timeRemaining = 10;
  timerElement.innerHTML = timeRemaining;

  timerInterval = setInterval(() => {
    timeRemaining--;
    timerElement.innerHTML = timeRemaining;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      handleAnswer('', '');
    }
  }, 1000);
}

// Next question
nextButton.onclick = () => {
  currentQuestionIndex++;
  feedbackContainer.classList.add('hidden');
  nextButtonContainer.classList.add('hidden');
  
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    endGame();
  }
};

// End the game
function endGame() {
  gameContainer.classList.add('hidden');
  gameOverContainer.classList.remove('hidden');
  finalScore.innerHTML = score;
}

// Restart the game
restartButton.onclick = () => {
  score = 0;
  currentQuestionIndex = 0;
  fetchTriviaQuestions();
  gameOverContainer.classList.add('hidden');
  startContainer.classList.remove('hidden');
};

// Decode HTML entities
function decodeHTML(text) {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
}
