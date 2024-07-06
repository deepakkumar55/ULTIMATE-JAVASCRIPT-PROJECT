import { $, $$ } from './utils.js';
import {
  API_BASE_URL,
  CACHE_EXPIRATION,
  DEFAULT_CURRENCY,
  FALLBACK_CURRENCIES,
  MAX_DECIMAL_PLACES
} from './constants.js';

class CurrencyConverter {
    constructor() {
        this.amountInput = $('#amount');
        this.fromCurrencySelect = $('#fromCurrency');
        this.toCurrencySelect = $('#toCurrency');
        this.resultInput = $('#result');
        this.convertBtn = $('#convertBtn');
        this.currencies = [];
        this.cache = {};
    }

    async init() {
        await this.fetchSupportedCurrencies();
        this.populateCurrencySelects();
        this.setupEventListeners();
    }

    async fetchSupportedCurrencies() {
        try {
            const response = await fetch(`${API_BASE_URL}${DEFAULT_CURRENCY}`);
            const data = await response.json();
            this.currencies = Object.keys(data.rates);
        } catch (error) {
            console.error('Error fetching supported currencies:', error);
            this.currencies = FALLBACK_CURRENCIES;
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
        const amount = this.amountInput.value;
        const fromCurrency = this.fromCurrencySelect.value;
        const toCurrency = this.toCurrencySelect.value;

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
        const cacheKey = `${fromCurrency}_${toCurrency}`;
        const cachedData = this.cache[cacheKey];

        if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
            return cachedData.rate;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${fromCurrency}`);
            const data = await response.json();
            const rate = data.rates[toCurrency];

            this.cache[cacheKey] = {
                rate: rate,
                timestamp: Date.now()
            };

            return rate;
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            throw error;
        }
    }
}

export default CurrencyConverter;