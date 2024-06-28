const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const transactionForm = document.getElementById('transaction-form');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const category = document.getElementById('category');

let transactions = [];

function addTransaction(e) {
    e.preventDefault();

    if (description.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a description and amount');
    } else {
        const transaction = {
            id: generateID(),
            description: description.value,
            amount: +amount.value,
            category: category.value,
            isIncome: category.value === 'Income'
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();

        description.value = '';
        amount.value = '';
    }
}

function generateID() {
    return Math.floor(Math.random() * 1000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.isIncome ? '+' : '-';
    const item = document.createElement('li');

    item.classList.add(transaction.isIncome ? 'plus' : 'minus');

    item.innerHTML = `
        ${transaction.description} (${transaction.category}) <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.isIncome ? transaction.amount : -transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const incomeTotal = transactions
        .filter(transaction => transaction.isIncome)
        .reduce((acc, transaction) => (acc += transaction.amount), 0)
        .toFixed(2);

    const expenseTotal = transactions
        .filter(transaction => !transaction.isIncome)
        .reduce((acc, transaction) => (acc += transaction.amount), 0)
        .toFixed(2);

    balance.innerText = `$${total}`;
    income.innerText = `+$${incomeTotal}`;
    expense.innerText = `-$${expenseTotal}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    init();
}

function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

transactionForm.addEventListener('submit', addTransaction);
