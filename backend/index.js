const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { initDB, db } = require('./db/db'); 
const transactionsRoutes = require('./routes/transactions');

// Initiate DB
initDB(db);

// Middleware
app.use(express.json()); 
app.use('/api/transactions', transactionsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});