import { STORAGE_KEYS } from './constants.js';

export class CompletionCounter {
  constructor(sessionElement, totalElement) {
    this.sessionElement = sessionElement;
    this.totalElement = totalElement;
    this.sessionCompletions = 0;
    this.totalCompletions = this.loadTotalCompletions();
  }

  increment() {
    this.sessionCompletions++;
    this.totalCompletions++;
    this.saveTotalCompletions();
    this.updateDisplay();
  }

  updateDisplay() {
    this.sessionElement.textContent = `Pomodoros this session: ${this.sessionCompletions}`;
    this.totalElement.textContent = `Total Pomodoros: ${this.totalCompletions}`;
  }

  loadTotalCompletions() {
    const saved = localStorage.getItem(STORAGE_KEYS.TOTAL_POMODORO_COMPLETIONS);
    return saved ? parseInt(saved, 10) : 0;
  }

  saveTotalCompletions() {
    localStorage.setItem(STORAGE_KEYS.TOTAL_POMODORO_COMPLETIONS, this.totalCompletions.toString());
  }
}
