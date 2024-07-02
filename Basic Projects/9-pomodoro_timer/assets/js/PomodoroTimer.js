import { TimerDisplay } from './TimerDisplay.js';
import { CompletionCounter } from './CompletionCounter.js';
import { Settings } from './Settings.js';
import { DarkMode } from './DarkMode.js';
import { AlarmSound } from './AlarmSound.js';
import { AlarmDialog } from './AlarmDialog.js';
import { $$, $ } from './domUtils.js';
import { TIMER_STATUS, BUTTON_TEXT, MESSAGES, CONFIRM_TEXT } from './constants.js';

export class PomodoroTimer {
  constructor() {
    this.settings = new Settings(this.handleSettingsChange.bind(this));
    this.display = new TimerDisplay($('#timer'));
    this.counter = new CompletionCounter(
      $('#sessionCount'),
      $('#totalCount')
    );
    this.darkMode = new DarkMode();

    this.timeLeft = this.settings.workTime;
    this.isRunning = false;
    this.interval = null;
    this.isWorkTime = true;

    this.startStopButton = $('#startStop');
    this.resetButton = $('#reset');

    this.startStopButton.addEventListener('click', () => this.startStop());

    this.display.update(this.timeLeft);
    this.counter.updateDisplay();
    this.settings.initModal();
    this.updateStatus(true);

    const alarmSoundElement = $('#alarmSound');
    this.alarmSound = new AlarmSound(alarmSoundElement);
    this.alarmDialog = new AlarmDialog(this.alarmSound, this.start.bind(this), this.pause.bind(this));

    this.isBreakTime = false;
  }

  startStop() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  
  start() {
    this.isRunning = true;
    this.startStopButton.textContent = BUTTON_TEXT.PAUSE;
    clearInterval(this.interval);
    this.interval = setInterval(() => this.decrementTimer(), 1000);
    this.updateStatus(this.isWorkTime);
  }

  pause() {
    this.isRunning = false;
    this.startStopButton.textContent = BUTTON_TEXT.START;
    clearInterval(this.interval);
    this.timeLeft = this.settings.workTime;
    this.isWorkTime = true;
    this.display.update(this.timeLeft);
    this.updateStatus(this.isWorkTime);
  }

  reset() {
    this.pause();
    this.timeLeft = this.settings.workTime;
    this.isWorkTime = true;
    this.updateStatus(this.isWorkTime);
    this.display.update(this.timeLeft);
  }

  decrementTimer() {
    this.timeLeft--;
    if (this.timeLeft < 0) {
      this.switchMode();
    }
    this.display.update(this.timeLeft);
  }

  updateStatus(isWorkTime) {
    const statusElement = $('#timer-status');
    if (isWorkTime) {
      statusElement.textContent = TIMER_STATUS.WORK;
      statusElement.className = 'timer-status';
    } else {
      statusElement.textContent = TIMER_STATUS.BREAK;
      statusElement.className = 'timer-status break';
    }
  }

  switchMode() {
    if (this.isWorkTime) {
      this.counter.increment();
      const isLongBreakTime = this.counter.sessionCompletions % this.settings.cyclesBeforeLongBreak === 0;
      this.timeLeft = isLongBreakTime ? this.settings.longBreakTime : this.settings.breakTime;
      this.isWorkTime = false;
      this.isBreakTime = isLongBreakTime;
    } else {
      this.timeLeft = this.settings.workTime;
      this.isWorkTime = true;
      this.isBreakTime = false;
    }
    this.playAlarm();
    this.display.update(this.timeLeft);
    this.counter.updateDisplay();
    this.updateStatus(this.isWorkTime);
  }

  playAlarm() {
    this.alarmSound.play();
    this.alarmDialog.show(this.isWorkTime);
  }

  handleSettingsChange(newSettings) {
    this.timeLeft = newSettings.workTime;
    this.isWorkTime = true;
    this.display.update(this.timeLeft);
    this.counter.updateDisplay();
  }
}
