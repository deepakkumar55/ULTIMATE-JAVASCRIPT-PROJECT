import { TIME_CONVERSION } from './constants.js';

export class TimerDisplay {
  constructor(element) {
    this.element = element;
  }

  update(timeLeft) {
    const minutes = Math.floor(timeLeft / TIME_CONVERSION.SECONDS_IN_MINUTE);
    const seconds = timeLeft % TIME_CONVERSION.SECONDS_IN_MINUTE;
    this.element.textContent = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
  }

  formatTime(time) {
    return time.toString().padStart(2, '0');
  }
}
