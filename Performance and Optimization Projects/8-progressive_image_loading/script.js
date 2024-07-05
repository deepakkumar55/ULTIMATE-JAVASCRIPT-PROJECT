import ThemeManager from './assets/js/ThemeManager.js';
import ProgressiveImageLoader from './assets/js/ProgressiveImageLoader.js';

document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new ProgressiveImageLoader();
});