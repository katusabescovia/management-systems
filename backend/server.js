const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Connect to MongoDB
const mongoURI = 'mongodb+srv://scovia:jaxville@scovia.uqcyz.mongodb.net/test?retryWrites=true&w=majority&appName=SCOVIA';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true // Note: This option is deprecated but included for compatibility
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Importing routes
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/income');
const shoppingListRoutes = require('./routes/shoppingLists');
const reportRoutes = require('./routes/reports');

// Setting up API routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/shoppinglists', shoppingListRoutes);
app.use('/api/reports', reportRoutes);

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Ensure that landing.html is accessible
app.get('/landing', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'landing.html'));
});

// Fallback route for undefined paths
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
