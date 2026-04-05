(() => {
  const display = document.getElementById('display');
  const expression = document.getElementById('expression');

  let current = '0';
  let previous = '';
  let operator = null;
  let shouldReset = false;

  function updateDisplay() {
    display.textContent = current;
    if (operator && previous) {
      const opSymbol = { '/': '÷', '*': '×', '-': '−', '+': '+' }[operator];
      expression.textContent = `${previous} ${opSymbol}`;
    } else {
      expression.textContent = '';
    }
  }

  function inputNumber(num) {
    if (shouldReset) {
      current = num;
      shouldReset = false;
    } else if (current === '0' && num !== '.') {
      current = num;
    } else {
      if (current.length >= 15) return;
      current += num;
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (shouldReset) {
      current = '0.';
      shouldReset = false;
      updateDisplay();
      return;
    }
    if (!current.includes('.')) {
      current += '.';
      updateDisplay();
    }
  }

  function inputOperator(op) {
    if (operator && !shouldReset) {
      calculate();
    }
    previous = current;
    operator = op;
    shouldReset = true;
    updateDisplay();
  }

  function calculate() {
    if (!operator || !previous) return;

    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result;

    switch (operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b === 0 ? 'Error' : a / b; break;
    }

    if (result === 'Error') {
      current = 'Error';
    } else {
      // Avoid floating point display issues
      current = String(parseFloat(result.toPrecision(12)));
    }

    expression.textContent = '';
    previous = '';
    operator = null;
    shouldReset = true;
    updateDisplay();
  }

  function clear() {
    current = '0';
    previous = '';
    operator = null;
    shouldReset = false;
    updateDisplay();
  }

  function backspace() {
    if (shouldReset || current === 'Error') {
      clear();
      return;
    }
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay();
  }

  function percent() {
    current = String(parseFloat(current) / 100);
    updateDisplay();
  }

  // Button clicks
  document.querySelector('.buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const action = btn.dataset.action;
    switch (action) {
      case 'number':   inputNumber(btn.dataset.value); break;
      case 'decimal':  inputDecimal(); break;
      case 'operator': inputOperator(btn.dataset.value); break;
      case 'equals':   calculate(); break;
      case 'clear':    clear(); break;
      case 'backspace': backspace(); break;
      case 'percent':  percent(); break;
    }
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
    else if (e.key === '.') inputDecimal();
    else if (e.key === '+') inputOperator('+');
    else if (e.key === '-') inputOperator('-');
    else if (e.key === '*') inputOperator('*');
    else if (e.key === '/') { e.preventDefault(); inputOperator('/'); }
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Escape') clear();
    else if (e.key === 'Backspace') backspace();
    else if (e.key === '%') percent();
  });

  updateDisplay();
})();
