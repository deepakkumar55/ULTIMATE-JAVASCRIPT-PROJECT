const ELEMENTS = {
  BILL: 'bill',
  TIP_PERCENTAGE: 'tipPercentage',
  CUSTOM_TIP: 'customTip',
  PEOPLE: 'people',
  CALCULATE: 'calculate',
  TIP_AMOUNT: 'tipAmount',
  TOTAL_AMOUNT: 'totalAmount',
  AMOUNT_PER_PERSON: 'amountPerPerson',
  CUSTOM_TIP_INPUT: 'customTipInput',
  THEME_TOGGLE: 'themeToggle'
};

const CLASSES = {
  DARK_THEME: 'dark-theme',
  HIDDEN: 'calculator__input--hidden'
};

const STORAGE_KEY = 'darkModeEnabled';

const MESSAGES = {
  INVALID_INPUT: 'Please enter valid numbers'
};

const $$ = (selector) => document.querySelectorAll(selector);
const $ = (selector) => document.querySelector(selector);

class TipCalculator {
  constructor() {
    this.elements = {
      bill: $(`#${ELEMENTS.BILL}`),
      tipPercentage: $(`#${ELEMENTS.TIP_PERCENTAGE}`),
      customTip: $(`#${ELEMENTS.CUSTOM_TIP}`),
      people: $(`#${ELEMENTS.PEOPLE}`),
      calculate: $(`#${ELEMENTS.CALCULATE}`),
      tipAmount: $(`#${ELEMENTS.TIP_AMOUNT}`),
      totalAmount: $(`#${ELEMENTS.TOTAL_AMOUNT}`),
      amountPerPerson: $(`#${ELEMENTS.AMOUNT_PER_PERSON}`),
      customTipInput: $(`#${ELEMENTS.CUSTOM_TIP_INPUT}`),
      themeToggle: $(`#${ELEMENTS.THEME_TOGGLE}`)
    };
    this.addEventListeners();
    this.loadThemePreference();
  }

  addEventListeners() {
    this.elements.calculate.addEventListener('click', () => this.calculate());
    this.elements.tipPercentage.addEventListener('change', () => this.toggleCustomTip());
    this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
  }

  loadThemePreference() {
    const isDarkMode = localStorage.getItem(STORAGE_KEY) === 'true';
    document.body.classList.toggle(CLASSES.DARK_THEME, isDarkMode);
  }

  toggleCustomTip() {
    const isCustom = this.elements.tipPercentage.value === 'custom';
    this.elements.customTipInput.classList.toggle(CLASSES.HIDDEN, !isCustom);
  }

  calculate() {
    const { bill, tipPercentage, people } = this.getInputValues();

    if (isNaN(bill) || isNaN(tipPercentage)) {
      alert(MESSAGES.INVALID_INPUT);
      return;
    }

    const results = this.computeResults(bill, tipPercentage, people);
    this.displayResults(results);
  }

  getInputValues() {
    const bill = parseFloat(this.elements.bill.value);
    let tipPercentage = parseFloat(this.elements.tipPercentage.value);
    if (this.elements.tipPercentage.value === 'custom') {
      tipPercentage = parseFloat(this.elements.customTip.value) / 100;
    }
    const people = parseInt(this.elements.people.value) || 1;

    return { bill, tipPercentage, people };
  }

  computeResults(bill, tipPercentage, people) {
    const tipAmount = bill * tipPercentage;
    const totalAmount = bill + tipAmount;
    const amountPerPerson = totalAmount / people;

    return { tipAmount, totalAmount, amountPerPerson };
  }

  displayResults({ tipAmount, totalAmount, amountPerPerson }) {
    this.elements.tipAmount.textContent = `$${tipAmount.toFixed(2)}`;
    this.elements.totalAmount.textContent = `$${totalAmount.toFixed(2)}`;
    this.elements.amountPerPerson.textContent = `$${amountPerPerson.toFixed(2)}`;
  }

  toggleTheme() {
    document.body.classList.toggle(CLASSES.DARK_THEME);
    const isDarkMode = document.body.classList.contains(CLASSES.DARK_THEME);
    localStorage.setItem(STORAGE_KEY, isDarkMode);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TipCalculator();
});