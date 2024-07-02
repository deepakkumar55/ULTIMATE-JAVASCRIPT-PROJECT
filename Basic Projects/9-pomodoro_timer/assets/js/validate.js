import { $ } from './domUtils.js';
import { VALIDATE_MESSAGES } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
  const cyclesBeforeLongBreakInput = $('#cyclesBeforeLongBreak');

  function validateIntegerInput(event) {
    const input = event.target;
    const value = parseFloat(input.value);

    if (!Number.isInteger(value)) {
      alert(VALIDATE_MESSAGES.INVALID_INTEGER);
      input.value = 1;
    }
  }

  cyclesBeforeLongBreakInput.addEventListener('blur', validateIntegerInput);
});
