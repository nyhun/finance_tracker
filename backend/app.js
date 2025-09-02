const express = require('express');
const app = express();
const transactionsRoutes = require('./routes/transactions');

app.use(express.json());
app.use('/api/transactions', transactionsRoutes);

module.exports = app;