const $$ = (selector) => document.querySelectorAll(selector);
const $ = (selector) => document.querySelector(selector);

const SELECTORS = {
  HEIGHT: '#height',
  WEIGHT: '#weight',
  RESULT: '#result',
  CALCULATE_BTN: '#calculateBtn',
  THEME_TOGGLE_BTN: '#themeToggle',
};

const STORAGE_KEYS = {
  DARK_MODE: 'darkMode',
};

const BMI_CATEGORIES = {
  UNDERWEIGHT: { max: 18.5, label: 'Underweight' },
  NORMAL: { max: 25, label: 'Normal weight' },
  OVERWEIGHT: { max: 30, label: 'Overweight' },
  OBESE: { max: Infinity, label: 'Obese' },
};

const ERROR_MESSAGES = {
  INVALID_INPUT: "Please enter valid height and weight.",
};

class BMICalculator {
  constructor() {
    this.initSelectors();
    this.bindEvents();
    this.initTheme();
  }

  initSelectors() {
    this.heightInput = $(SELECTORS.HEIGHT);
    this.weightInput = $(SELECTORS.WEIGHT);
    this.resultDiv = $(SELECTORS.RESULT);
    this.calculateBtn = $(SELECTORS.CALCULATE_BTN);
    this.themeToggleBtn = $(SELECTORS.THEME_TOGGLE_BTN);
  }

  bindEvents() {
    this.calculateBtn.addEventListener('click', this.calculateBMI.bind(this));
    this.themeToggleBtn.addEventListener('click', this.toggleDarkMode.bind(this));
  }

  initTheme() {
    const isDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'enabled';
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
      document.body.classList.add('dark-mode');
    }
    this.updateThemeToggleButton(isDarkMode);
  }

  calculateBMI() {
    const height = this.getHeight();
    const weight = this.getWeight();

    if (this.isValidInput(height, weight)) {
      const bmi = this.computeBMI(weight, height);
      const category = this.determineBMICategory(bmi);
      this.displayResult(bmi, category);
    } else {
      this.displayError();
    }
  }

  getHeight() {
    return parseFloat(this.heightInput.value) / 100;
  }

  getWeight() {
    return parseFloat(this.weightInput.value);
  }

  isValidInput(height, weight) {
    return !isNaN(height) && !isNaN(weight) && height > 0 && weight > 0;
  }

  computeBMI(weight, height) {
    return weight / (height * height);
  }

  determineBMICategory(bmi) {
    for (const category of Object.values(BMI_CATEGORIES)) {
      if (bmi < category.max) {
        return category.label;
      }
    }
  }

  displayResult(bmi, category) {
    this.resultDiv.innerHTML = `Your BMI is: ${bmi.toFixed(2)}<br>Category: ${category}`;
  }

  displayError() {
    this.resultDiv.textContent = ERROR_MESSAGES.INVALID_INPUT;
  }

  toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    this.updateThemeToggleButton(isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode ? 'enabled' : 'disabled');
  }

  updateThemeToggleButton(isDarkMode) {
    this.themeToggleBtn.style.color = isDarkMode ? '#fff' : '#333';
  }
}

document.addEventListener('DOMContentLoaded', () => new BMICalculator());