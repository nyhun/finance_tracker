const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactions');

router.post('/', (req, res) => {
    const { type, amount, category, date } = req.body;

    if (!type || !amount || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Invalid transaction type' });
    }

    try {
        const newTransaction = transactionService.createTransaction({ type, amount, category, date });
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { type, amount, category, date } = req.body;

    if (!type || !amount || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Invalid transaction type' });
    }

    try {
        const updated = transactionService.updateTransaction(id, { type, amount, category, date });
        if (updated) res.json({ success: true });
        else res.status(404).json({ error: 'Transaction not found' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    try {
        const deleted = transactionService.deleteTransaction(id);
        if (deleted) res.json({ success: true });
        else res.status(404).json({ error: 'Transaction not found' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});

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
