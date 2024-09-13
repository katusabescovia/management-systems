// controllers/shoppingListsController.js
const ShoppingList = require('../models/shoppingList');

// Create a new shopping list
// controllers/shoppingListsController.js


// Create a new shopping list
exports.createShoppingList = async (req, res) => {
  try {
    const { name, items, overallTotal } = req.body;

    // Validate input data
    if (!name || !Array.isArray(items) || items.length === 0 || overallTotal === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields: name, items, and overall total.' });
    }

    // Validate each item in the items array
    for (const item of items) {
      const { itemNumber, itemName, quantity, unitPrice, totalCost } = item;
      if (!itemNumber || !itemName || quantity === undefined || unitPrice === undefined || totalCost === undefined) {
        return res.status(400).json({ message: 'Each item must have itemNumber, itemName, quantity, unitPrice, and totalCost.' });
      }
    }

    // Create and save the new shopping list
    const newList = new ShoppingList({ name, items, overallTotal });
    const savedList = await newList.save();

    res.status(201).json({ message: 'Shopping list saved successfully!', list: savedList });
  } catch (error) {
    console.error('Error saving shopping list:', error.message);
    res.status(500).json({ message: `Failed to save shopping list: ${error.message}` });
  }
};


// Fetch all shopping lists
exports.getShoppingLists = async (req, res) => {
  try {
    const lists = await ShoppingList.find();
    res.json(lists);
  } catch (error) {
    console.error('Error fetching shopping lists:', error.message);
    res.status(500).json({ message: 'Failed to fetch shopping lists' });
  }
};

// Fetch a single shopping list by ID
exports.getShoppingListById = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    res.json(list);
  } catch (error) {
    console.error('Error fetching shopping list:', error.message);
    res.status(500).json({ message: 'Failed to fetch the shopping list' });
  }
};

// Update a shopping list by ID
exports.updateShoppingList = async (req, res) => {
  try {
    const { name, items, overallTotal } = req.body;
    const updatedList = await ShoppingList.findByIdAndUpdate(
      req.params.id,
      { name, items, overallTotal },
      { new: true }
    );
    if (!updatedList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    res.json(updatedList);
  } catch (error) {
    console.error('Error updating shopping list:', error.message);
    res.status(500).json({ message: 'Failed to update the shopping list' });
  }
};

// Delete a shopping list by ID
exports.deleteShoppingList = async (req, res) => {
  try {
    const list = await ShoppingList.findByIdAndDelete(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    res.json({ message: 'Shopping list deleted successfully' });
  } catch (error) {
    console.error('Error deleting shopping list:', error.message);
    res.status(500).json({ message: 'Failed to delete the shopping list' });
  }
};
