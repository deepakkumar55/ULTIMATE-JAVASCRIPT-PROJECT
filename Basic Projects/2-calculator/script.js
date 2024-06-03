const display = document.getElementById('display');
let displayValue = '';

function appendNumber(number) {
    if (displayValue === '0' && number !== '.') {
        displayValue = number;
    } else {
        displayValue += number;
    }
    updateDisplay();
}

function updateDisplay() {
    display.textContent = displayValue;
}

function clearDisplay() {
    displayValue = '0';
    updateDisplay();
}

function deleteNumber() {
    displayValue = displayValue.slice(0, -1);
    if (displayValue === '') {
        displayValue = '0';
    }
    updateDisplay();
}

function compute() {
    try {
        displayValue = eval(displayValue).toString();
    } catch {
        displayValue = 'Error';
    }
    updateDisplay();
}
