// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for cross-origin requests

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expenseTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Importing route files
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/income');
const shoppingListRoutes = require('./routes/shoppingLists'); // Correct path
const reportRoutes = require('./routes/reports');

// Setting up routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/shoppinglists', shoppingListRoutes); // Ensure path is correct
app.use('/api/reports', reportRoutes);

// Fallback route for undefined paths
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
