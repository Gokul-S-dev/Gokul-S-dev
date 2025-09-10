// Calculator state variables
let display = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operator = null;
let waitingForNewInput = false;
let hasDecimal = false;

// Initialize calculator
function init() {
    updateDisplay();
    setupKeyboardListener();
}

// Update the display
function updateDisplay() {
    display.textContent = currentInput;
    
    // Add error class if display shows "Error"
    if (currentInput === 'Error') {
        display.classList.add('error');
        setTimeout(() => {
            display.classList.remove('error');
        }, 1000);
    } else {
        display.classList.remove('error');
    }
}

// Handle number input
function inputNumber(num) {
    if (waitingForNewInput) {
        currentInput = num;
        waitingForNewInput = false;
        hasDecimal = false;
    } else {
        if (currentInput === '0') {
            currentInput = num;
        } else if (currentInput.length < 12) { // Limit display length
            currentInput += num;
        }
    }
    updateDisplay();
    animateButton();
}

// Handle decimal input
function inputDecimal() {
    if (waitingForNewInput) {
        currentInput = '0.';
        waitingForNewInput = false;
        hasDecimal = true;
    } else if (!hasDecimal) {
        if (currentInput === '0') {
            currentInput = '0.';
        } else {
            currentInput += '.';
        }
        hasDecimal = true;
    }
    updateDisplay();
    animateButton();
}

// Handle operator input
function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === '') {
        previousInput = currentInput;
    } else if (operator) {
        const previousValue = parseFloat(previousInput);
        const result = performCalculation(previousValue, inputValue, operator);
        
        if (result === null) return; // Error occurred
        
        currentInput = String(result);
        previousInput = currentInput;
    }

    waitingForNewInput = true;
    hasDecimal = false;
    operator = nextOperator;
    updateDisplay();
    animateButton();
}

// Perform calculation
function performCalculation(prev, current, operation) {
    let result;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                updateDisplay();
                setTimeout(() => {
                    clearAll();
                }, 2000);
                return null;
            }
            result = prev / current;
            break;
        default:
            return current;
    }
    
    // Handle very large or very small numbers
    if (!isFinite(result)) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(() => {
            clearAll();
        }, 2000);
        return null;
    }
    
    // Round to avoid floating point precision issues
    if (result !== Math.floor(result)) {
        result = Math.round(result * 100000000) / 100000000;
    }
    
    // Limit result length
    if (String(result).length > 12) {
        result = parseFloat(result.toExponential(6));
    }
    
    return result;
}

// Calculate result
function calculate() {
    if (operator && !waitingForNewInput) {
        const inputValue = parseFloat(currentInput);
        const previousValue = parseFloat(previousInput);
        const result = performCalculation(previousValue, inputValue, operator);
        
        if (result !== null) {
            currentInput = String(result);
            previousInput = '';
            operator = null;
            waitingForNewInput = true;
            hasDecimal = currentInput.includes('.');
            updateDisplay();
        }
    }
    animateButton();
}

// Clear all (C button)
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    waitingForNewInput = false;
    hasDecimal = false;
    updateDisplay();
    animateButton();
}

// Clear entry (CE button)
function clearEntry() {
    currentInput = '0';
    hasDecimal = false;
    updateDisplay();
    animateButton();
}

// Delete last character (backspace)
function deleteLast() {
    if (currentInput.length > 1 && currentInput !== 'Error') {
        if (currentInput[currentInput.length - 1] === '.') {
            hasDecimal = false;
        }
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
        hasDecimal = false;
    }
    updateDisplay();
    animateButton();
}

// Animate button press
function animateButton() {
    // This function can be enhanced to animate the pressed button
    // For now, it's a placeholder for future enhancements
}

// Keyboard support
function setupKeyboardListener() {
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        // Prevent default for calculator keys
        if (isCalculatorKey(key)) {
            event.preventDefault();
        }
        
        // Handle number keys
        if (key >= '0' && key <= '9') {
            inputNumber(key);
        }
        // Handle decimal point
        else if (key === '.' || key === ',') {
            inputDecimal();
        }
        // Handle operators
        else if (key === '+') {
            inputOperator('+');
        }
        else if (key === '-') {
            inputOperator('-');
        }
        else if (key === '*') {
            inputOperator('*');
        }
        else if (key === '/' || key === '÷') {
            inputOperator('/');
        }
        // Handle equals and enter
        else if (key === '=' || key === 'Enter') {
            calculate();
        }
        // Handle clear functions
        else if (key === 'Escape' || key === 'c' || key === 'C') {
            clearAll();
        }
        else if (key === 'Delete') {
            clearEntry();
        }
        // Handle backspace
        else if (key === 'Backspace') {
            deleteLast();
        }
    });
}

// Check if key is a calculator key
function isCalculatorKey(key) {
    const calculatorKeys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '+', '-', '*', '/', '=', '.', ',',
        'Enter', 'Escape', 'Backspace', 'Delete',
        'c', 'C', '÷'
    ];
    return calculatorKeys.includes(key);
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', init);