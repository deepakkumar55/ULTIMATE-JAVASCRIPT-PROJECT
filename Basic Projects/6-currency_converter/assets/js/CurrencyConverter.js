import { $, $$ } from './utils.js';
import {
  API_BASE_URL,
  CACHE_EXPIRATION,
  DEFAULT_CURRENCY,
  FALLBACK_CURRENCIES,
  MAX_DECIMAL_PLACES
} from './constants.js';
import apiClient from './ApiClient.js';

class CurrencyConverter {
  constructor() {
    this.amountInput = $('#amount');
    this.fromCurrencySelect = $('#fromCurrency');
    this.toCurrencySelect = $('#toCurrency');
    this.resultInput = $('#result');
    this.convertBtn = $('#convertBtn');
    this.currencies = [];
  }

  async init() {
    await this.fetchSupportedCurrencies();
    this.setupEventListeners();
  }

  async fetchSupportedCurrencies() {
    const options = {
      cacheDuration: CACHE_EXPIRATION,
      onWait: this.showLoadingState.bind(this),
      onSuccess: this.handleFetchSuccess.bind(this),
      onFailure: this.handleFetchFailure.bind(this),
      onComplete: this.hideLoadingState.bind(this),
    };

    apiClient.request(`${API_BASE_URL}${DEFAULT_CURRENCY}`, options);
  }

  showLoadingState() {
    this.setSelectLoadingState(this.fromCurrencySelect);
    this.setSelectLoadingState(this.toCurrencySelect);
  }

  setSelectLoadingState(selectElement) {
    selectElement.innerHTML = '<option value="Loading...">Loading...</option>';
    selectElement.disabled = true;
  }

  handleFetchSuccess(data) {
    this.currencies = Object.keys(data.rates);
    this.populateCurrencySelects();
  }

  handleFetchFailure(error) {
    console.error("Failure:", error);
    this.currencies = FALLBACK_CURRENCIES;
    this.populateCurrencySelects();
  }

  hideLoadingState() {
    this.fromCurrencySelect.disabled = false;
    this.toCurrencySelect.disabled = false;
    this.removeLoadingOption(this.fromCurrencySelect);
    this.removeLoadingOption(this.toCurrencySelect);
  }

  removeLoadingOption(selectElement) {
    const loadingOption = selectElement.querySelector('option[value="Loading..."]');
    if (loadingOption) {
      selectElement.removeChild(loadingOption);
    }
  }

  populateCurrencySelects() {
    this.currencies.forEach(currency => {
      this.fromCurrencySelect.add(new Option(currency, currency));
      this.toCurrencySelect.add(new Option(currency, currency));
    });
  }

  setupEventListeners() {
    this.convertBtn.addEventListener('click', () => this.convertCurrency());
  }

  async convertCurrency() {
    const amount = parseFloat(this.amountInput.value);
    const fromCurrency = this.fromCurrencySelect.value;
    const toCurrency = this.toCurrencySelect.value;

    if (isNaN(amount)) {
      this.resultInput.value = 'Invalid amount';
      return;
    }

    try {
      const rate = await this.getExchangeRate(fromCurrency, toCurrency);
      const result = (amount * rate).toFixed(MAX_DECIMAL_PLACES);
      this.resultInput.value = `${result} ${toCurrency}`;
    } catch (error) {
      console.error('Error converting currency:', error);
      this.resultInput.value = 'Error converting currency';
    }
  }

  async getExchangeRate(fromCurrency, toCurrency) {
    const options = {
      onWait: () => {
        this.convertBtn.disabled = true;
        this.resultInput.value = "Loading..."
      },
      onComplete: () => { this.convertBtn.disabled = false; },
    };

    const { success, data, error } = await apiClient.request(`${API_BASE_URL}${fromCurrency}`, options);

    if (success) {
      return data.rates[toCurrency];
    } else {
      throw error;
    }
  }
}

export default CurrencyConverter;