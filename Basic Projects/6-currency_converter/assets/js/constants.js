export const ELEMENTS = {
  ROOT: ':root',
  BODY: 'body',
  THEME_SWITCHER: {
    LIGHT: '#lightTheme',
    DARK: '#darkTheme'
  },
  COLOR_PICKER: {
    PRIMARY: '#primaryColorPicker',
    SECONDARY: '#secondaryColorPicker'
  }
};

export const CLASSES = {
  DARK_THEME: 'dark-theme'
};

export const STORAGE_KEYS = {
  THEME: 'theme',
  PRIMARY_COLOR: '--primary-color',
  SECONDARY_COLOR: '--secondary-color'
};

export const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/';
export const CACHE_EXPIRATION = 3600000; // 1 hour in milliseconds
export const DEFAULT_CURRENCY = 'USD';
export const FALLBACK_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
export const MAX_DECIMAL_PLACES = 2;