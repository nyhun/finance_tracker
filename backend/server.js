const app = require('./app');
const { db, initDB } = require('./db/db');

initDB(db); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
