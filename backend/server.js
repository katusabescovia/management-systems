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
  // The following options are deprecated but included for compatibility
  useNewUrlParser: true,
  useUnifiedTopology: true
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
  const indexPath = path.join(__dirname, '..', 'frontend', 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

// Ensure that landing.html is accessible
app.get('/landing', (req, res) => {
  const landingPath = path.join(__dirname, '..', 'frontend', 'landing.html');
  console.log('Serving landing.html from:', landingPath);
  res.sendFile(landingPath);
});

// Fallback route for undefined paths
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start the server
const PORT = process.env.PORT || 5000; // Use the PORT provided by Render or fallback to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
