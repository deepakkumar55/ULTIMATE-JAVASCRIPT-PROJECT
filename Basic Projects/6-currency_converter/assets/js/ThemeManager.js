import { ELEMENTS, STORAGE_KEYS, CLASSES } from './constants.js';

import { $ } from './utils.js';

class ThemeManager {
  constructor() {
    this.root = $(ELEMENTS.ROOT);
    this.lightThemeBtn = $(ELEMENTS.THEME_SWITCHER.LIGHT);
    this.darkThemeBtn = $(ELEMENTS.THEME_SWITCHER.DARK);
    this.primaryColorPicker = $(ELEMENTS.COLOR_PICKER.PRIMARY);
    this.secondaryColorPicker = $(ELEMENTS.COLOR_PICKER.SECONDARY);

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadSavedTheme();
    this.loadSavedColors();
  }

  setupEventListeners() {
    this.lightThemeBtn.addEventListener('click', () => this.setTheme('light'));
    this.darkThemeBtn.addEventListener('click', () => this.setTheme('dark'));
    this.primaryColorPicker.addEventListener('input', (e) => this.setColor(STORAGE_KEYS.PRIMARY_COLOR, e.target.value));
    this.secondaryColorPicker.addEventListener('input', (e) => this.setColor(STORAGE_KEYS.SECONDARY_COLOR, e.target.value));
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }

  loadSavedColors() {
    const savedPrimaryColor = localStorage.getItem(STORAGE_KEYS.PRIMARY_COLOR);
    const savedSecondaryColor = localStorage.getItem(STORAGE_KEYS.SECONDARY_COLOR);

    if (savedPrimaryColor) {
      this.setColor(STORAGE_KEYS.PRIMARY_COLOR, savedPrimaryColor);
      this.primaryColorPicker.value = savedPrimaryColor;
    }
    if (savedSecondaryColor) {
      this.setColor(STORAGE_KEYS.SECONDARY_COLOR, savedSecondaryColor);
      this.secondaryColorPicker.value = savedSecondaryColor;
    }
  }

  setTheme(theme) {
    $(ELEMENTS.BODY).classList.toggle(CLASSES.DARK_THEME, theme === 'dark');
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  setColor(property, value) {
    this.root.style.setProperty(property, value);
    localStorage.setItem(property, value);
  }
}

export default ThemeManager;