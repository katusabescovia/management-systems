const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');

router.post('/', incomeController.createIncome);
router.get('/', incomeController.getAllIncomes);
router.delete('/:id', incomeController.deleteIncome);
router.put('/:id', incomeController.updateIncome); // Add this line

module.exports = router;
