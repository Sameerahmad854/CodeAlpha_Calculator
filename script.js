const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

let currentValue = "";
let previousValue = "";
let operation = null;

// Update calculator display
function updateDisplay() {
  currentDisplay.textContent = currentValue || "0";

  if (operation !== null) {
    previousDisplay.textContent = `${previousValue} ${getOperationSymbol(operation)}`;
  } else {
    previousDisplay.textContent = "";
  }
}

// Add number to display
function appendNumber(number) {
  // Start a new calculation after an error
  if (currentValue === "Error") {
    currentValue = "";
  }

  // Prevent multiple decimal points
  if (number === "." && currentValue.includes(".")) {
    return;
  }

  // Add 0 before decimal
  if (number === "." && currentValue === "") {
    currentValue = "0";
  }

  currentValue += number;

  updateDisplay();
}

// Select mathematical operation
function chooseOperation(selectedOperation) {
  // An error must be cleared before choosing another operation
  if (currentValue === "Error") {
    return;
  }

  if (currentValue === "" && previousValue === "") {
    return;
  }

  // Change operation if no second number entered
  if (currentValue === "" && previousValue !== "") {
    operation = selectedOperation;
    updateDisplay();
    return;
  }

  // Calculate previous operation first
  if (previousValue !== "") {
    calculate();
  }

  previousValue = currentValue;

  currentValue = "";

  operation = selectedOperation;

  updateDisplay();
}

// Calculate result
function calculate() {
  if (previousValue === "" || currentValue === "" || operation === null) {
    return;
  }

  const previous = parseFloat(previousValue);
  const current = parseFloat(currentValue);

  let result;

  switch (operation) {
    case "+":
      result = previous + current;
      break;

    case "-":
      result = previous - current;
      break;

    case "*":
      result = previous * current;
      break;

    case "/":
      if (current === 0) {
        currentValue = "Error";

        previousValue = "";

        operation = null;

        updateDisplay();

        return;
      }

      result = previous / current;
      break;
  }

  currentValue = formatResult(result);

  previousValue = "";

  operation = null;

  updateDisplay();
}

// Keep floating-point results readable
function formatResult(result) {
  return String(parseFloat(result.toFixed(10)));
}

// Clear calculator
function clearCalculator() {
  currentValue = "";

  previousValue = "";

  operation = null;

  updateDisplay();
}

// Delete last character
function deleteNumber() {
  if (currentValue === "Error") {
    currentValue = "";
  } else {
    currentValue = currentValue.slice(0, -1);
  }

  updateDisplay();
}

// Convert operation into display symbol
function getOperationSymbol(operation) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  };

  return symbols[operation];
}

// Number buttons
document.querySelectorAll("[data-number]").forEach((button) => {
  button.addEventListener("click", () => {
    appendNumber(button.dataset.number);
  });
});

// Operation buttons
document.querySelectorAll("[data-operation]").forEach((button) => {
  button.addEventListener("click", () => {
    chooseOperation(button.dataset.operation);
  });
});

// Equal button
document
  .querySelector('[data-action="calculate"]')
  .addEventListener("click", calculate);

// Clear button
document
  .querySelector('[data-action="clear"]')
  .addEventListener("click", clearCalculator);

// Delete button
document
  .querySelector('[data-action="delete"]')
  .addEventListener("click", deleteNumber);

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;

  // Numbers and decimal
  if ((key >= "0" && key <= "9") || key === ".") {
    event.preventDefault();
    appendNumber(key);
    return;
  }

  // Operators
  if (key === "+" || key === "-" || key === "*" || key === "/") {
    event.preventDefault();
    chooseOperation(key);
    return;
  }

  // Enter or =
  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
    return;
  }

  // Escape = Clear
  if (key === "Escape") {
    event.preventDefault();
    clearCalculator();
    return;
  }

  // Backspace = Delete
  if (key === "Backspace") {
    event.preventDefault();
    deleteNumber();
  }
});
