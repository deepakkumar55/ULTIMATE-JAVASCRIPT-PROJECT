const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const ELEMENTS = {
  CONTAINER: '.countdown',
  HOURS: '.countdown__selector--hours',
  MINUTES: '.countdown__selector--minutes',
  SECONDS: '.countdown__selector--seconds',
  DISPLAY: '.countdown__display',
  START_STOP: '.countdown__button--start-stop',
  CLEAR: '.countdown__button--clear',
  DARK_MODE: '.countdown__button--dark-mode'
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

const BUTTON_TEXT = {
  START: 'Start',
  STOP: 'Stop'
};

const TIME_UNITS = {
  HOURS: 3600,
  MINUTES: 60,
  SECONDS: 1
};

const MESSAGES = {
  TIME_UP: "Time's up! The countdown has ended."
};

const DISPLAY = {
  ZERO_TIME: "00:00:00"
};

class CountdownTimer {
  constructor() {
    this.elements = {
      container: $(ELEMENTS.CONTAINER),
      hoursSelect: $(ELEMENTS.HOURS),
      minutesSelect: $(ELEMENTS.MINUTES),
      secondsSelect: $(ELEMENTS.SECONDS),
      display: $(ELEMENTS.DISPLAY),
      startStopButton: $(ELEMENTS.START_STOP),
      clearButton: $(ELEMENTS.CLEAR),
      darkModeToggle: $(ELEMENTS.DARK_MODE)
    };
    this.countdown = null;
    this.isRunning = false;

    this.initializeSelects();
    this.addEventListeners();
    this.initDarkMode();
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
    this.elements.startStopButton.textContent = BUTTON_TEXT.STOP;
    this.isRunning = true;
  }

  stopTimer() {
    clearInterval(this.countdown);
    this.elements.startStopButton.textContent = BUTTON_TEXT.START;
    this.isRunning = false;
  }

  clearTimer() {
    this.stopTimer();
    this.setSelectValues(0, 0, 0);
    this.updateDisplay(DISPLAY.ZERO_TIME);
  }

  updateTimer() {
    let totalSeconds = this.getTotalSeconds();

    if (totalSeconds <= 0) {
      this.stopTimer();
      this.updateDisplay(DISPLAY.ZERO_TIME);
      alert(MESSAGES.TIME_UP);
      return;
    }

    totalSeconds--;
    this.setTimeFromSeconds(totalSeconds);
  }

  getTotalSeconds() {
    const hours = parseInt(this.elements.hoursSelect.value);
    const minutes = parseInt(this.elements.minutesSelect.value);
    const seconds = parseInt(this.elements.secondsSelect.value);
    return hours * TIME_UNITS.HOURS + minutes * TIME_UNITS.MINUTES + seconds * TIME_UNITS.SECONDS;
  }

  setTimeFromSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / TIME_UNITS.HOURS);
    const minutes = Math.floor((totalSeconds % TIME_UNITS.HOURS) / TIME_UNITS.MINUTES);
    const seconds = totalSeconds % TIME_UNITS.MINUTES;

    this.setSelectValues(hours, minutes, seconds);
    this.updateDisplay(`${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`);
  }

  setSelectValues(hours, minutes, seconds) {
    this.elements.hoursSelect.value = hours;
    this.elements.minutesSelect.value = minutes;
    this.elements.secondsSelect.value = seconds;
  }

  updateDisplay(time) {
    this.elements.display.textContent = time;
  }

  toggleDarkMode() {
    document.body.classList.toggle(DARK_MODE.CLASS);
    localStorage.setItem(DARK_MODE.STORAGE_KEY, document.body.classList.contains(DARK_MODE.CLASS) ? DARK_MODE.ENABLED : DARK_MODE.DISABLED);
  }

  initDarkMode() {
    if (localStorage.getItem(DARK_MODE.STORAGE_KEY) === DARK_MODE.ENABLED) {
      document.body.classList.add(DARK_MODE.CLASS);
    }
  }

  padZero(num) {
    return num.toString().padStart(2, '0');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CountdownTimer();
});