const expenseform = document.getElementById('expenseform');
const expenselist = document.getElementById('expenselist');
const totalamountElement = document.getElementById('totalamount');
let total = 0;

expenseform.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const desc = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;
    const amountNumber = parseFloat(amount);

    if (desc && category && !isNaN(amountNumber)) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${desc}</td><td>${category}</td><td>${amountNumber.toFixed(2)}</td>`;
        expenselist.appendChild(newRow);
        
        total += amountNumber;
        totalamountElement.textContent = total.toFixed(2);
        
        document.getElementById('description').value = '';
        document.getElementById('category').value = '';
        document.getElementById('amount').value = '';
    } else {
        alert('Please fill out all fields with valid data.');
    }
});
