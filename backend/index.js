const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { initDB } = require('./db/db'); 

// Middleware (optional)
app.use(express.json()); // To parse JSON bodies

// Initiate DB
const db = initDB()

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});