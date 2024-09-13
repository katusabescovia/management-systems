const ShoppingList = require('../models/shoppingList');

exports.createShoppingList = async (req, res) => {
  try {
    const { name, items, overallTotal } = req.body;
    const newList = new ShoppingList({ name, items, overallTotal });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    console.error('Failed to create shopping list:', error);
    res.status(500).send('Failed to create shopping list');
  }
};

exports.getShoppingLists = async (req, res) => {
  try {
    const lists = await ShoppingList.find();
    res.json(lists);
  } catch (error) {
    console.error('Failed to fetch shopping lists:', error);
    res.status(500).send('Failed to fetch shopping lists');
  }
};

exports.getShoppingListById = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) return res.status(404).send('Shopping list not found');
    res.json(list);
  } catch (error) {
    console.error('Failed to fetch shopping list:', error);
    res.status(500).send('Failed to fetch shopping list');
  }
};

exports.updateShoppingList = async (req, res) => {
  try {
    const list = await ShoppingList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!list) return res.status(404).send('Shopping list not found');
    res.json(list);
  } catch (error) {
    console.error('Failed to update shopping list:', error);
    res.status(500).send('Failed to update shopping list');
  }
};

exports.deleteShoppingList = async (req, res) => {
  try {
    const list = await ShoppingList.findByIdAndDelete(req.params.id);
    if (!list) return res.status(404).send('Shopping list not found');
    res.sendStatus(204);
  } catch (error) {
    console.error('Failed to delete shopping list:', error);
    res.status(500).send('Failed to delete shopping list');
  }
};
