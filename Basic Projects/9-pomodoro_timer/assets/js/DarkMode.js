import { $ } from './domUtils.js';
import { STORAGE_KEYS } from './constants.js';

export class DarkMode {
  constructor() {
    this.toggle = $('#darkModeToggle');
    this.body = document.body;
    this.init();
  }

  init() {
    const isDarkMode = this.loadDarkModeSetting();
    this.body.classList.toggle('dark-mode', isDarkMode);
    this.toggle.addEventListener('click', () => this.toggleDarkMode());
  }

  loadDarkModeSetting() {
    return localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
  }

  saveDarkModeSetting(isDarkMode) {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode);
  }

  toggleDarkMode() {
    const isDarkMode = !this.body.classList.contains('dark-mode');
    this.body.classList.toggle('dark-mode', isDarkMode);
    this.saveDarkModeSetting(isDarkMode);
  }
}
