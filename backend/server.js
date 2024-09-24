const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for cross-origin requests

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

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
const shoppingListRoutes = require('./routes/shoppingLists');
const reportRoutes = require('./routes/reports');

// Setting up routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/shoppinglists', shoppingListRoutes);
app.use('/api/reports', reportRoutes);

// Serve HTML files
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
// });

// app.get('/landing', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'frontend', 'landing.html'));
// });

// Fallback route for undefined paths
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
