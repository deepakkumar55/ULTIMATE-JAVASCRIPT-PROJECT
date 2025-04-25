document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const display = document.getElementById('display');
  const calculation = document.getElementById('calculation');
  const buttons = document.querySelectorAll('.btn');
  const historyToggle = document.getElementById('history-toggle');
  const historyPanel = document.getElementById('history-panel');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history');
  const themeToggle = document.getElementById('theme-toggle');

  // Calculator State
  const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    calculationString: '',
    history: JSON.parse(localStorage.getItem('calculatorHistory')) || []
  };

  // Update the display with the current value
  function updateDisplay() {
    display.textContent = calculator.displayValue;
    calculation.textContent = calculator.calculationString;
    
    // Add animation effect
    display.classList.add('animate-pop');
    setTimeout(() => {
      display.classList.remove('animate-pop');
    }, 300);
  }

  // Handle number inputs
  function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
    
    if (waitingForSecondOperand) {
      calculator.displayValue = digit;
      calculator.waitingForSecondOperand = false;
    } else {
      // Overwrite '0' if that's the current display value
      calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
  }

  // Handle decimal point
  function inputDecimal(dot) {
    // If we're waiting for a second operand, set display to "0."
    if (calculator.waitingForSecondOperand) {
      calculator.displayValue = '0.';
      calculator.waitingForSecondOperand = false;
      return;
    }
    
    // If the display value doesn't contain a decimal point
    if (!calculator.displayValue.includes(dot)) {
      calculator.displayValue += dot;
    }
  }

  // Handle operators
  function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);
    
    // Verify that firstOperand is null and that the inputValue
    // is not NaN
    if (firstOperand === null && !isNaN(inputValue)) {
      // Update the first operand
      calculator.firstOperand = inputValue;
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      
      // Update the display with the calculation result
      calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
      calculator.firstOperand = result;
    }
    
    // Update calculation string
    if (calculator.calculationString === '' || calculator.waitingForSecondOperand) {
      calculator.calculationString = `${calculator.displayValue} ${nextOperator} `;
    } else {
      if (operator) {
        const lastChar = calculator.calculationString.slice(-2, -1);
        if ('+-×÷%'.includes(lastChar)) {
          calculator.calculationString = calculator.calculationString.slice(0, -2) + `${nextOperator} `;
        } else {
          calculator.calculationString += `${nextOperator} `;
        }
      } else {
        calculator.calculationString = `${displayValue} ${nextOperator} `;
      }
    }
    
    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
  }

  // Perform calculation based on operator
  function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
      return firstOperand + secondOperand;
    } else if (operator === '−') {
      return firstOperand - secondOperand;
    } else if (operator === '×') {
      return firstOperand * secondOperand;
    } else if (operator === '÷') {
      return secondOperand !== 0 ? firstOperand / secondOperand : displayError();
    } else if (operator === '%') {
      return firstOperand % secondOperand;
    }
    
    return secondOperand;
  }

  // Display error when dividing by zero
  function displayError() {
    calculator.displayValue = 'Error';
    display.classList.add('animate-shake');
    setTimeout(() => {
      display.classList.remove('animate-shake');
    }, 500);
    return 0;
  }

  // Reset the calculator
  function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.calculationString = '';
    updateDisplay();
  }

  // Delete the last digit
  function deleteLastDigit() {
    if (calculator.waitingForSecondOperand) return;
    
    calculator.displayValue = calculator.displayValue.length === 1 ? 
      '0' : calculator.displayValue.slice(0, -1);
  }

  // Toggle positive/negative
  function toggleSign() {
    const { displayValue } = calculator;
    const currentValue = parseFloat(displayValue);
    
    if (!isNaN(currentValue) && currentValue !== 0) {
      calculator.displayValue = String(currentValue * -1);
    }
  }

  // Handle calculate (equals button)
  function handleCalculate() {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);
    
    if (operator && !calculator.waitingForSecondOperand) {
      const result = calculate(firstOperand, inputValue, operator);
      
      // Create calculation string for history
      const calculationText = `${calculator.calculationString}${displayValue}`;
      const resultText = `${parseFloat(result.toFixed(7))}`;
      
      // Add to history
      addToHistory(calculationText, resultText);
      
      // Update calculator state
      calculator.displayValue = resultText;
      calculator.firstOperand = result;
      calculator.waitingForSecondOperand = true;
      calculator.operator = null;
      calculator.calculationString = calculationText + ' =';
    }
  }

  // Add calculation to history
  function addToHistory(calculation, result) {
    if (result === 'Error') return;
    
    const historyItem = {
      calculation,
      result,
      timestamp: new Date().getTime()
    };
    
    calculator.history.unshift(historyItem);
    
    // Limit history to 10 items
    if (calculator.history.length > 10) {
      calculator.history.pop();
    }
    
    // Save to localStorage
    localStorage.setItem('calculatorHistory', JSON.stringify(calculator.history));
    
    // Update history display
    updateHistoryDisplay();
  }

  // Update history panel display
  function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    if (calculator.history.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No calculations yet';
      emptyMessage.style.textAlign = 'center';
      emptyMessage.style.color = 'var(--text-secondary)';
      emptyMessage.style.padding = '20px 0';
      historyList.appendChild(emptyMessage);
      return;
    }
    
    calculator.history.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="history-calculation">${item.calculation}</div>
        <div class="history-result">${item.result}</div>
      `;
      
      // Allow clicking on history item to load it
      historyItem.addEventListener('click', () => {
        calculator.displayValue = item.result;
        calculator.firstOperand = parseFloat(item.result);
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
        calculator.calculationString = '';
        updateDisplay();
        toggleHistoryPanel();
      });
      
      historyList.appendChild(historyItem);
    });
  }

  // Clear history
  function clearHistory() {
    calculator.history = [];
    localStorage.removeItem('calculatorHistory');
    updateHistoryDisplay();
  }

  // Toggle history panel
  function toggleHistoryPanel() {
    historyPanel.classList.toggle('show');
    updateHistoryDisplay();
  }

  // Toggle theme (light/dark)
  function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    // Update theme icon
    if (document.body.classList.contains('dark-theme')) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('calculatorTheme', 'dark');
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('calculatorTheme', 'light');
    }
  }

  // Check for saved theme preference
  function checkThemePreference() {
    const savedTheme = localStorage.getItem('calculatorTheme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  // Event listeners for buttons
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Add button press animation
      button.classList.add('animate-pop');
      setTimeout(() => {
        button.classList.remove('animate-pop');
      }, 300);
      
      // Handle different button types
      if (button.classList.contains('number')) {
        inputDigit(button.dataset.number);
      } else if (button.classList.contains('operator')) {
        const operatorMap = {
          'add': '+',
          'subtract': '−',
          'multiply': '×',
          'divide': '÷',
          'percent': '%'
        };
        handleOperator(operatorMap[button.dataset.action]);
      } else if (button.classList.contains('equals')) {
        handleCalculate();
      } else if (button.classList.contains('function')) {
        const action = button.dataset.action;
        if (action === 'clear') {
          resetCalculator();
        } else if (action === 'delete') {
          deleteLastDigit();
        } else if (action === 'plusMinus') {
          toggleSign();
        }
      }
      
      updateDisplay();
    });
  });

  // Event listeners for history and theme toggle
  historyToggle.addEventListener('click', toggleHistoryPanel);
  clearHistoryBtn.addEventListener('click', clearHistory);
  themeToggle.addEventListener('click', toggleTheme);

  // Close history panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!historyPanel.contains(e.target) && 
        !historyToggle.contains(e.target) && 
        historyPanel.classList.contains('show')) {
      toggleHistoryPanel();
    }
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    // Numbers
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      inputDigit(e.key);
    }
    // Operators
    else if (e.key === '+') {
      e.preventDefault();
      handleOperator('+');
    } else if (e.key === '-') {
      e.preventDefault();
      handleOperator('−');
    } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
      e.preventDefault();
      handleOperator('×');
    } else if (e.key === '/') {
      e.preventDefault();
      handleOperator('÷');
    } else if (e.key === '%') {
      e.preventDefault();
      handleOperator('%');
    }
    // Decimal
    else if (e.key === '.') {
      e.preventDefault();
      inputDecimal('.');
    }
    // Equals
    else if (e.key === '=' || e.key === 'Enter') {
      e.preventDefault();
      handleCalculate();
    }
    // Clear
    else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
      e.preventDefault();
      resetCalculator();
    }
    // Backspace
    else if (e.key === 'Backspace') {
      e.preventDefault();
      deleteLastDigit();
    }
    
    updateDisplay();
  });

  // Initialize
  checkThemePreference();
  updateDisplay();
  updateHistoryDisplay();
});
