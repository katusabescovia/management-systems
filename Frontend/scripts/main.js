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

    document.getElementById('total-expenses').textContent = `Total Expenses: shs ${totalExpenses.toFixed(2)}`;
    document.getElementById('total-income').textContent = `Total Income: shs ${totalIncome.toFixed(2)}`;
    document.getElementById('balance').textContent = `Balance: shs ${balance.toFixed(2)}`;
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
        <td>shs ${expense.amount.toFixed(2)}</td>
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
        <td>shs ${income.amount.toFixed(2)}</td>
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
// Generate and display reports
// Add event listeners to all report buttons
// Attach event listeners to report buttons
document.querySelectorAll('#report-section button').forEach(button => {
  button.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default form behavior

    // Capture the period based on button text
    const period = e.target.textContent.trim().toLowerCase();
    const startDate = document.getElementById('start-date').value.trim();
    const endDate = document.getElementById('end-date').value.trim();
    const category = document.getElementById('report-category').value.trim(); // Get updated category ID

    // Debug: Log input values for troubleshooting
    console.log('Period:', period);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Category:', category);

    // Construct the API URL
    let url = `http://localhost:5000/api/reports?period=${encodeURIComponent(period)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;

    // Only append category if it's provided
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    // Debug: Log the constructed request URL
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

// Function to display reports in the specified format
function displayReports(report) {
  const reportOutput = document.getElementById('report-output');
  reportOutput.innerHTML = `
    <h3 style="color: #7c5fb8;">Daily Report</h3>
    ${generateReportTable(report.daily)}

    <h3 style="color: #7c5fb8;">Weekly Report</h3>
    ${generateReportTable(report.weekly)}

    <h3 style="color: #7c5fb8;">Monthly Report</h3>
    ${generateReportTable(report.monthly)}

    <h3 style="color: #7c5fb8;">Yearly Report</h3>
    ${generateReportTable(report.yearly)}
  `;
}

// Function to generate a report table based on the data
function generateReportTable(data) {
  if (!data || Object.keys(data).length === 0) {
    return '<p>No data available for this period.</p>'; // Display message if no data
  }

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
            <td>${entry.details.map(d => `shs ${d.amount.toFixed(2)}`).join(', ')}</td>
            <td>shs ${entry.total.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `; 
}


// main.js
// main.js
// main.js
// main.js
document.addEventListener('DOMContentLoaded', () => {
  displayShoppingLists();
  document.getElementById('shopping-list-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('add-item-button').addEventListener('click', addItem);
  document.getElementById('add-edit-item-button').addEventListener('click', addEditItem);
  document.getElementById('cancel-edit-button').addEventListener('click', cancelEdit);
  document.getElementById('edit-form').addEventListener('submit', saveEdit); 
});

let editingListId = null;

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

function addEditItem() {
  const container = document.getElementById('edit-items-container');
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
      const response = await fetch('http://127.0.0.1:5000/api/shoppinglists');
      if (!response.ok) throw new Error(`Failed to fetch shopping lists: ${response.statusText}`);

      const shoppingLists = await response.json();
      const container = document.getElementById('shopping-lists');
      container.innerHTML = '';

      shoppingLists.forEach(list => {
          const listCard = document.createElement('div');
          listCard.classList.add('card');
          listCard.innerHTML = `<h2>${list.name}</h2>`;
          listCard.addEventListener('click', () => showShoppingListDetails(list._id));  // Display full details on click
          container.appendChild(listCard);
      });
  } catch (error) {
      console.error('An error occurred while fetching shopping lists:', error.message);
      alert(`Error: ${error.message}`);
  }
}

async function showShoppingListDetails(listId) {
  try {
      const response = await fetch(`http://127.0.0.1:5000/api/shoppinglists/${listId}`);
      if (!response.ok) throw new Error(`Failed to fetch shopping list: ${response.statusText}`);

      const list = await response.json();
      const container = document.getElementById('shopping-lists');
      container.innerHTML = '';

      const listTable = document.createElement('table');
      listTable.classList.add('shopping-list-table');
      listTable.innerHTML = `
          <thead>
              <tr>
                  <th>Item Number</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Cost</th>
              </tr>
          </thead>
          <tbody>
              ${list.items.map(item => `
                  <tr>
                      <td>${item.itemNumber}</td>
                      <td>${item.itemName}</td>
                      <td>${item.quantity}</td>
                      <td>${item.unitPrice.toFixed(2)}</td>
                      <td>${item.totalCost.toFixed(2)}</td>
                  </tr>
              `).join('')}
          </tbody>
          <tfoot>
              <tr>
                  <td colspan="4"><strong>Overall Total:</strong></td>
                  <td>${list.overallTotal.toFixed(2)}</td>
              </tr>
          </tfoot>
      `;

      const listCard = document.createElement('div');
      listCard.classList.add('card');
      listCard.innerHTML = `<h2>${list.name}</h2>`;
      listCard.appendChild(listTable);
      listCard.innerHTML += `
          <button onclick="editShoppingList('${list._id}')">Edit</button>
          <button onclick="deleteShoppingList('${list._id}')">Delete</button>
      `;
      container.appendChild(listCard);
  } catch (error) {
      console.error('An error occurred while fetching shopping list details:', error.message);
      alert(`Error: ${error.message}`);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('list-name').value;
  const items = Array.from(document.querySelectorAll('#items-container .item')).map(item => ({
      itemNumber: item.querySelector('.item-number').value,
      itemName: item.querySelector('.item-name').value,
      quantity: parseInt(item.querySelector('.quantity').value, 10),
      unitPrice: parseFloat(item.querySelector('.unit-price').value),
      totalCost: parseFloat(item.querySelector('.total-cost').value),
  }));
  const overallTotal = items.reduce((sum, item) => sum + item.totalCost, 0);

  try {
      const response = await fetch('http://127.0.0.1:5000/api/shoppinglists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, items, overallTotal }),
      });

      if (!response.ok) throw new Error(`Failed to save shopping list: ${response.statusText}`);

      await displayShoppingLists();
      event.target.reset();
  } catch (error) {
      console.error('An error occurred while saving the shopping list:', error.message);
      alert(`Error: ${error.message}`);
  }
}

async function editShoppingList(listId) {
  try {
      const response = await fetch(`http://127.0.0.1:5000/api/shoppinglists/${listId}`);
      if (!response.ok) throw new Error(`Failed to fetch shopping list: ${response.statusText}`);

      const list = await response.json();
      editingListId = listId;
      showEditForm(list);
  } catch (error) {
      console.error('An error occurred while fetching the shopping list:', error.message);
      alert(`Error: ${error.message}`);
  }
}

function showEditForm(list) {
  document.getElementById('shopping-list-form-container').style.display = 'none';
  document.getElementById('edit-shopping-list-container').style.display = 'block';

  document.getElementById('edit-list-name').value = list.name;
  const editItemsContainer = document.getElementById('edit-items-container');
  editItemsContainer.innerHTML = '';

  list.items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      itemDiv.innerHTML = `
          <input type="number" class="item-number" placeholder="Item Number" value="${item.itemNumber}" required>
          <input type="text" class="item-name" placeholder="Item Name" value="${item.itemName}" required>
          <input type="number" class="quantity" placeholder="Quantity" value="${item.quantity}" required>
          <input type="number" class="unit-price" placeholder="Unit Price" value="${item.unitPrice}" required>
          <input type="number" class="total-cost" placeholder="Total Cost" value="${item.totalCost}" readonly>
          <button type="button" onclick="calculateTotal(this)">Calculate Total</button>
          <button type="button" onclick="removeItem(this)">Remove Item</button>
      `;
      editItemsContainer.appendChild(itemDiv);
  });
}

async function saveEdit(event) {
  event.preventDefault();

  const name = document.getElementById('edit-list-name').value;
  const items = Array.from(document.querySelectorAll('#edit-items-container .item')).map(item => ({
      itemNumber: item.querySelector('.item-number').value,
      itemName: item.querySelector('.item-name').value,
      quantity: parseInt(item.querySelector('.quantity').value, 10),
      unitPrice: parseFloat(item.querySelector('.unit-price').value),
      totalCost: parseFloat(item.querySelector('.total-cost').value),
  }));
  const overallTotal = items.reduce((sum, item) => sum + item.totalCost, 0);

  try {
      const response = await fetch(`http://127.0.0.1:5000/api/shoppinglists/${editingListId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, items, overallTotal }),
      });

      if (!response.ok) throw new Error(`Failed to update shopping list: ${response.statusText}`);

      editingListId = null;
      document.getElementById('edit-form').reset();
      document.getElementById('edit-shopping-list-container').style.display = 'none';
      document.getElementById('shopping-list-form-container').style.display = 'block';
      await displayShoppingLists();
  } catch (error) {
      console.error('An error occurred while updating the shopping list:', error.message);
      alert(`Error: ${error.message}`);
  }
}

function cancelEdit() {
  editingListId = null;
  document.getElementById('edit-form').reset();
  document.getElementById('edit-shopping-list-container').style.display = 'none';
  document.getElementById('shopping-list-form-container').style.display = 'block';
}

async function deleteShoppingList(listId) {
  try {
      const response = await fetch(`http://127.0.0.1:5000/api/shoppinglists/${listId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Failed to delete shopping list: ${response.statusText}`);

      await displayShoppingLists();
  } catch (error) {
      console.error('An error occurred while deleting the shopping list:', error.message);
      alert(`Error: ${error.message}`);
  }
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const heading = document.getElementById('dashboard-heading');
  const newHeadingInput = document.getElementById('new-heading');
  const changeHeadingButton = document.getElementById('change-heading-button');

  // Add event listener to the button to change the heading dynamically
  changeHeadingButton.addEventListener('click', () => {
    const newHeading = newHeadingInput.value;

    if (newHeading.trim() !== "") {
      heading.textContent = newHeading;
    } else {
      alert("Please enter a new heading.");
    }
  });

  // Add event listener to the input to change the heading color when focused
  newHeadingInput.addEventListener('focus', () => {
    heading.classList.add('purple-heading');
  });

  // Remove the purple-heading class when the input loses focus
  newHeadingInput.addEventListener('blur', () => {
    heading.classList.remove('purple-heading');
  });
});


// Initial load
loadDashboard();
loadExpenses();
loadIncomes();




