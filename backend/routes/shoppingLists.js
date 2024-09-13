const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListsController');

router.post('/', shoppingListController.createShoppingList);
router.get('/', shoppingListController.getShoppingLists);
router.get('/:id', shoppingListController.getShoppingListById);
router.put('/:id', shoppingListController.updateShoppingList);
router.delete('/:id', shoppingListController.deleteShoppingList);

module.exports = router;
