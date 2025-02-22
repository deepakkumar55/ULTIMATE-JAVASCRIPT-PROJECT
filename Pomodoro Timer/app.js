const timer = document.getElementById("timer");
const quote = document.getElementById("quote");

let time = 1500;
let interval = null;
let running = false;

function updateTime(time) {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  timer.textContent = `${minutes}:${seconds}`;
}

function pauseTimer() {
  if (!running) return;
  clearInterval(interval);
  running = false;
  quote.textContent = "paused";
}

function startTimer() {
  if (running) return; //Prevent multiple intervals
  running = true;
  quote.textContent = "Keep Going !";
  interval = setInterval(function () {
    if (time > 0) {
      time--;
      updateTime(time);
    } else {
      clearInterval(interval);
      running = false;
      quote.textContent = "Time's Up!";
    }
  }, 1000);
}

function resetTime() {
  clearInterval(interval);
  running = false;
  time = 1500;
  quote.textContent = "Hi !";

  updateTime(time);
}

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("pause").addEventListener("click", pauseTimer);
document.getElementById("reset").addEventListener("click", resetTime);
updateTime(time);
