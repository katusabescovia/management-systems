// Handle form submissions for adding expenses
document.getElementById('expense-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const category = document.getElementById('category').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const date = new Date(document.getElementById('expense-date').value).toISOString();
  const notes = document.getElementById('expense-notes').value;

  const response = await fetch('http://localhost:5000/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, amount, date, notes })
  });

  if (response.ok) {
    alert('Expense added successfully!');
    loadDashboard();
    loadExpenses();
  } else {
    alert('Failed to add expense.');
  }
});

// Handle form submissions for adding incomes
document.getElementById('income-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const source = document.getElementById('income-source').value;
  const amount = parseFloat(document.getElementById('income-amount').value);
  const date = new Date(document.getElementById('income-date').value).toISOString();
  const notes = document.getElementById('income-notes').value;

  const response = await fetch('http://localhost:5000/api/incomes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, amount, date, notes })
  });

  if (response.ok) {
    alert('Income added successfully!');
    loadDashboard();
    loadIncomes();
  } else {
    alert('Failed to add income.');
  }
});

// Handle expense updates
document.getElementById('update-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('update-id').value;
  const category = document.getElementById('update-category').value;
  const amount = parseFloat(document.getElementById('update-amount').value);
  const date = new Date(document.getElementById('update-date').value).toISOString();
  const notes = document.getElementById('update-notes').value;

  const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, amount, date, notes })
  });

  if (response.ok) {
    alert('Expense updated successfully!');
    loadExpenses();
    loadDashboard();
  } else {
    alert('Failed to update expense.');
  }
});

// Handle income updates
document.getElementById('update-income-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('update-income-id').value;
  const source = document.getElementById('update-income-source').value;
  const amount = parseFloat(document.getElementById('update-income-amount').value);
  const date = new Date(document.getElementById('update-income-date').value).toISOString();
  const notes = document.getElementById('update-income-notes').value;

  const response = await fetch(`http://localhost:5000/api/incomes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, amount, date, notes })
  });

  if (response.ok) {
    alert('Income updated successfully!');
    loadIncomes();
    loadDashboard();
  } else {
    alert('Failed to update income.');
  }
});

// Load the dashboard data
async function loadDashboard() {
  try {
    const expensesResponse = await fetch('http://localhost:5000/api/expenses');
    const incomesResponse = await fetch('http://localhost:5000/api/incomes');

    const expenses = await expensesResponse.json();
    const incomes = await incomesResponse.json();

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const balance = totalIncome - totalExpenses;

    document.getElementById('total-expenses').textContent = `Total Expenses: $${totalExpenses.toFixed(2)}`;
    document.getElementById('total-income').textContent = `Total Income: $${totalIncome.toFixed(2)}`;
    document.getElementById('balance').textContent = `Balance: $${balance.toFixed(2)}`;
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Load the expenses data
async function loadExpenses() {
  try {
    const response = await fetch('http://localhost:5000/api/expenses');
    const expenses = await response.json();

    const tbody = document.querySelector('#expenses-table tbody');
    tbody.innerHTML = '';

    expenses.forEach(expense => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expense.category}</td>
        <td>$${expense.amount.toFixed(2)}</td>
        <td>${new Date(expense.date).toLocaleDateString()}</td>
        <td>${expense.notes}</td>
        <td>
          <button onclick="editExpense('${expense._id}', '${expense.category}', ${expense.amount}, '${expense.date}', '${expense.notes}')">Edit</button>
          <button onclick="deleteExpense('${expense._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading expenses:', error);
  }
}

// Load the incomes data
async function loadIncomes() {
  try {
    const response = await fetch('http://localhost:5000/api/incomes');
    const incomes = await response.json();

    const tbody = document.querySelector('#income-table tbody');
    tbody.innerHTML = '';

    incomes.forEach(income => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${income.source || 'N/A'}</td>
        <td>$${income.amount.toFixed(2)}</td>
        <td>${new Date(income.date).toLocaleDateString()}</td>
        <td>${income.notes}</td>
        <td>
          <button onclick="editIncome('${income._id}', '${income.source}', ${income.amount}, '${income.date}', '${income.notes}')">Edit</button>
          <button onclick="deleteIncome('${income._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading incomes:', error);
  }
}

// Edit expense entry
function editExpense(id, category, amount, date, notes) {
  document.getElementById('update-id').value = id;
  document.getElementById('update-category').value = category;
  document.getElementById('update-amount').value = amount;
  document.getElementById('update-date').value = new Date(date).toISOString().split('T')[0];
  document.getElementById('update-notes').value = notes;
  document.getElementById('update-section').scrollIntoView();
}

// Edit income entry
function editIncome(id, source, amount, date, notes) {
  document.getElementById('update-income-id').value = id;
  document.getElementById('update-income-source').value = source;
  document.getElementById('update-income-amount').value = amount;
  document.getElementById('update-income-date').value = new Date(date).toISOString().split('T')[0];
  document.getElementById('update-income-notes').value = notes;
  document.getElementById('update-income-section').scrollIntoView();
}

// Delete expense entry
async function deleteExpense(id) {
  if (!confirm('Are you sure you want to delete this expense?')) return;

  const response = await fetch(`http://localhost:5000/api/expenses/${id}`, { method: 'DELETE' });
  if (response.ok) {
    alert('Expense deleted successfully!');
    loadExpenses();
    loadDashboard();
  } else {
    alert('Failed to delete expense.');
  }
}

// Delete income entry
async function deleteIncome(id) {
  if (!confirm('Are you sure you want to delete this income?')) return;

  const response = await fetch(`http://localhost:5000/api/incomes/${id}`, { method: 'DELETE' });
  if (response.ok) {
    alert('Income deleted successfully!');
    loadIncomes();
    loadDashboard();
  } else {
    alert('Failed to delete income.');
  }
}

// Generate and display reports
// Handle form submissions for reports
// Handle form submissions for reports
// Generate and display reports
document.querySelectorAll('#report-section button').forEach(button => {
  button.addEventListener('click', async (e) => {
      const period = e.target.textContent.toLowerCase();
      const startDate = document.getElementById('start-date').value;
      const endDate = document.getElementById('end-date').value;
      const category = document.getElementById('category').value;

      const url = `http://localhost:5000/api/reports?period=${encodeURIComponent(period)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&category=${encodeURIComponent(category)}`;

      console.log('Request URL:', url);

      try {
          const response = await fetch(url);
          if (response.ok) {
              const report = await response.json();
              displayReports(report);
          } else {
              alert('Failed to generate report. Status: ' + response.status);
          }
      } catch (error) {
          console.error('Error generating report:', error);
      }
  });
});

function displayReports(report) {
  const reportOutput = document.getElementById('report-output');
  reportOutput.innerHTML = `
      <h3>Daily Report</h3>
      ${generateReportTable(report.daily)}

      <h3>Weekly Report</h3>
      ${generateReportTable(report.weekly)}

      <h3>Monthly Report</h3>
      ${generateReportTable(report.monthly)}

      <h3>Yearly Report</h3>
      ${generateReportTable(report.yearly)}
  `;
}

function generateReportTable(data) {
  return `
      <table>
          <thead>
              <tr>
                  <th>Date/Period</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Total</th>
              </tr>
          </thead>
          <tbody>
              ${Object.entries(data).map(([key, entry]) => `
                  <tr>
                      <td>${key}</td>
                      <td>${entry.details.map(d => d.category).join(', ')}</td>
                      <td>${entry.details.map(d => `$${d.amount.toFixed(2)}`).join(', ')}</td>
                      <td>$${entry.total.toFixed(2)}</td>
                  </tr>
              `).join('')}
          </tbody>
      </table>
  `;
}



// main.js
// main.js
// main.js
document.addEventListener('DOMContentLoaded', () => {
  displayShoppingLists();
  document.getElementById('shopping-list-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('add-item-button').addEventListener('click', addItem);
});

function addItem() {
  const container = document.getElementById('items-container');
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('item');
  itemDiv.innerHTML = `
    <input type="number" class="item-number" placeholder="Item Number" required>
    <input type="text" class="item-name" placeholder="Item Name" required>
    <input type="number" class="quantity" placeholder="Quantity" required>
    <input type="number" class="unit-price" placeholder="Unit Price" required>
    <input type="number" class="total-cost" placeholder="Total Cost" readonly>
    <button type="button" onclick="calculateTotal(this)">Calculate Total</button>
    <button type="button" onclick="removeItem(this)">Remove Item</button>
  `;
  container.appendChild(itemDiv);
}

function calculateTotal(button) {
  const itemDiv = button.parentElement;
  const quantity = parseFloat(itemDiv.querySelector('.quantity').value) || 0;
  const unitPrice = parseFloat(itemDiv.querySelector('.unit-price').value) || 0;
  itemDiv.querySelector('.total-cost').value = (quantity * unitPrice).toFixed(2);
}

function removeItem(button) {
  button.parentElement.remove();
}

async function displayShoppingLists() {
  try {
    const response = await fetch('/api/shoppinglists');
    if (!response.ok) throw new Error('Failed to fetch shopping lists');
    const shoppingLists = await response.json();
    const container = document.getElementById('shopping-lists');
    container.innerHTML = '';
    shoppingLists.forEach(list => {
      const listCard = document.createElement('div');
      listCard.classList.add('card');
      listCard.innerHTML = `
        <h2>${list.name}</h2>
        ${list.items.map(item => `
          <p>${item.itemNumber}. ${item.itemName} - ${item.quantity} x ${item.unitPrice} = ${item.totalCost}</p>
        `).join('')}
        <p><strong>Overall Total: ${list.overallTotal}</strong></p>
        <button onclick="editShoppingList('${list._id}')">Edit</button>
        <button onclick="deleteShoppingList('${list._id}')">Delete</button>
      `;
      container.appendChild(listCard);
    });
  } catch (error) {
    console.error('An error occurred while fetching shopping lists:', error.message);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('list-name').value;
  const items = Array.from(document.querySelectorAll('.item')).map(item => ({
    itemNumber: item.querySelector('.item-number').value,
    itemName: item.querySelector('.item-name').value,
    quantity: parseInt(item.querySelector('.quantity').value, 10),
    unitPrice: parseFloat(item.querySelector('.unit-price').value),
    totalCost: parseFloat(item.querySelector('.total-cost').value),
  }));
  const overallTotal = items.reduce((sum, item) => sum + item.totalCost, 0);

  try {
    const response = await fetch('/api/shoppinglists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, items, overallTotal }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response Status:', response.status, response.statusText);
      console.error('Response Body:', errorText);
      throw new Error(`Failed to save shopping list: ${errorText}`);
    }
    
    const result = await response.json();
    await displayShoppingLists();
    event.target.reset();
  } catch (error) {
    console.error('An error occurred while saving the shopping list:', error.message);
    alert(`Error: ${error.message}`);
  }
}


// Initial load
loadDashboard();
loadExpenses();
loadIncomes();




