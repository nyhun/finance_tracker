const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactions');

router.get('/summary', (req, res) => {
  const { month, year, category } = req.query;

  if (!month || !year) {
    return res.status(400).json({ error: 'Month and year are required.' });
  }

  try {
    const summary = transactionService.getMonthlySummary({ month, year, category });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/export', (req, res) => {
  const { category, from, to } = req.query;

  try {
    const data = transactionService.getTransactions({ category, from, to });
    const fields = ['id', 'type', 'amount', 'category', 'date'];
    const csv = parse(data, { fields });
    
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'CSV export failed' });
  }
});

module.exports = router;
