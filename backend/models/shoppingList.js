const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [
    {
      itemNumber: { type: String, required: true },
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      totalCost: { type: Number, required: true },
    },
  ],
  overallTotal: { type: Number, required: true },
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
