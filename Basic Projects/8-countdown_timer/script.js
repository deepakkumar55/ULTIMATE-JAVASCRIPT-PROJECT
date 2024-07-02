const ELEMENTS = {
  HOURS: 'hours',
  MINUTES: 'minutes',
  SECONDS: 'seconds',
  TIMER: 'timer',
  START_STOP: 'startStop',
  CLEAR: 'clear',
  DARK_MODE_TOGGLE: 'darkModeToggle'
};

const TIME_LIMITS = {
  HOURS: 23,
  MINUTES: 59,
  SECONDS: 59
};

const DARK_MODE = {
  CLASS: 'dark-mode',
  STORAGE_KEY: 'darkMode',
  ENABLED: 'enabled',
  DISABLED: 'disabled'
};

class CountdownTimer {
  constructor() {
    this.elements = {
      hoursSelect: this.getElement(ELEMENTS.HOURS),
      minutesSelect: this.getElement(ELEMENTS.MINUTES),
      secondsSelect: this.getElement(ELEMENTS.SECONDS),
      timerDisplay: this.getElement(ELEMENTS.TIMER),
      startStopButton: this.getElement(ELEMENTS.START_STOP),
      clearButton: this.getElement(ELEMENTS.CLEAR),
      darkModeToggle: this.getElement(ELEMENTS.DARK_MODE_TOGGLE)
    };
    this.body = document.body;
    this.countdown = null;
    this.isRunning = false;

    this.initializeSelects();
    this.addEventListeners();
    this.initDarkMode();
  }

  getElement(id) {
    return document.getElementById(id);
  }

  initializeSelects() {
    this.populateSelect(this.elements.hoursSelect, 0, TIME_LIMITS.HOURS);
    this.populateSelect(this.elements.minutesSelect, 0, TIME_LIMITS.MINUTES);
    this.populateSelect(this.elements.secondsSelect, 0, TIME_LIMITS.SECONDS);
  }

  populateSelect(select, start, end) {
    for (let i = start; i <= end; i++) {
      select.options[select.options.length] = new Option(i.toString().padStart(2, '0'), i);
    }
  }

  addEventListeners() {
    this.elements.startStopButton.addEventListener('click', () => this.toggleTimer());
    this.elements.clearButton.addEventListener('click', () => this.clearTimer());
    this.elements.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
  }

  toggleTimer() {
    this.isRunning ? this.stopTimer() : this.startTimer();
  }

  startTimer() {
    this.countdown = setInterval(() => this.updateTimer(), 1000);
    this.elements.startStopButton.textContent = "Stop";
    this.isRunning = true;
  }

  stopTimer() {
    clearInterval(this.countdown);
    this.elements.startStopButton.textContent = "Start";
    this.isRunning = false;
  }

  clearTimer() {
    this.stopTimer();
    this.setSelectValues(0, 0, 0);
    this.updateDisplay("00:00:00");
  }

  updateTimer() {
    let totalSeconds = this.getTotalSeconds();

    if (totalSeconds <= 0) {
      this.stopTimer();
      this.updateDisplay("00:00:00");
      alert("Time's up! The countdown has ended.");
      return;
    }

    totalSeconds--;
    this.setTimeFromSeconds(totalSeconds);
  }

  getTotalSeconds() {
    const hours = parseInt(this.elements.hoursSelect.value);
    const minutes = parseInt(this.elements.minutesSelect.value);
    const seconds = parseInt(this.elements.secondsSelect.value);
    return hours * 3600 + minutes * 60 + seconds;
  }

  setTimeFromSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.setSelectValues(hours, minutes, seconds);
    this.updateDisplay(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }

  setSelectValues(hours, minutes, seconds) {
    this.elements.hoursSelect.value = hours;
    this.elements.minutesSelect.value = minutes;
    this.elements.secondsSelect.value = seconds;
  }

  updateDisplay(time) {
    this.elements.timerDisplay.textContent = time;
  }

  toggleDarkMode() {
    this.body.classList.toggle(DARK_MODE.CLASS);
    localStorage.setItem(DARK_MODE.STORAGE_KEY, this.body.classList.contains(DARK_MODE.CLASS) ? DARK_MODE.ENABLED : DARK_MODE.DISABLED);
  }

  initDarkMode() {
    if (localStorage.getItem(DARK_MODE.STORAGE_KEY) === DARK_MODE.ENABLED) {
      this.body.classList.add(DARK_MODE.CLASS);
    }
  }
}

const timer = new CountdownTimer();
