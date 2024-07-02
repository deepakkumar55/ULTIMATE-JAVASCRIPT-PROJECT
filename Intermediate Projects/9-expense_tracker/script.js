const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const transactionForm = document.getElementById('transaction-form');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const date = document.getElementById('date');
const category = document.getElementById('category');
const search = document.getElementById('search');
const filterCategory = document.getElementById('filter-category');
const filterDate = document.getElementById('filter-date');
const filterBtn = document.getElementById('filter-btn');

let transactions = [];

function addTransaction(e) {
    e.preventDefault();

    if (description.value.trim() === '' || amount.value.trim() === '' || date.value.trim() === '') {
        alert('Please add a description, amount, and date');
    } else {
        const transaction = {
            id: generateID(),
            description: description.value,
            amount: +amount.value,
            date: date.value,
            category: category.value,
            isIncome: category.value === 'Income'
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();

        description.value = '';
        amount.value = '';
        date.value = '';
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
        <span>${transaction.date}</span>
        <button class="edit-btn" onclick="editTransaction(${transaction.id})">edit</button>
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

function editTransaction(id) {
    const transaction = transactions.find(transaction => transaction.id === id);

    description.value = transaction.description;
    amount.value = Math.abs(transaction.amount);
    date.value = transaction.date;
    category.value = transaction.category;

    removeTransaction(id);
}

function filterTransactions() {
    const searchTerm = search.value.toLowerCase();
    const selectedCategory = filterCategory.value;
    const selectedDate = filterDate.value;

    const filteredTransactions = transactions.filter(transaction => {
        const matchDescription = transaction.description.toLowerCase().includes(searchTerm);
        const matchCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
        const matchDate = !selectedDate || transaction.date === selectedDate;

        return matchDescription && matchCategory && matchDate;
    });

    list.innerHTML = '';
    filteredTransactions.forEach(addTransactionDOM);
}

function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

transactionForm.addEventListener('submit', addTransaction);
filterBtn.addEventListener('click', filterTransactions);
search.addEventListener('input', filterTransactions);
filterCategory.addEventListener('change', filterTransactions);
filterDate.addEventListener('change', filterTransactions);
