// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Connect to MongoDB using environment variable
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('Error: MONGO_URI environment variable is not set.');
  // Optionally, you can exit the process or handle it as needed
}

mongoose.connect('mongodb+srv://scovia:jaxville@scovia.uqcyz.mongodb.net/?retryWrites=true&w=majority&appName=SCOVIA', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Importing route files
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/income');
const shoppingListRoutes = require('./routes/shoppingLists');
const reportRoutes = require('./routes/reports');

// Setting up routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/shoppinglists', shoppingListRoutes);
app.use('/api/reports', reportRoutes);

// Fallback route for undefined paths
app.use((req, res) => {
  res.status(404).json({ message: 'Page Not Found' });
});

// Export the Express app wrapped with serverless-http
module.exports.handler = serverless(app);
