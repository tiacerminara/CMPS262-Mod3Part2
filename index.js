const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Test route to confirm DB connection
app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'Connected to DB!', time: result.rows[0] });
  } catch (err) {
    console.error('Test route error:', err.message);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// GET route for /api/v1/products with optional filtering
app.get('/api/v1/products', async (req, res) => {
  const { category, maxPrice } = req.query;  // Capture 'category' and 'maxPrice' query parameters

  try {
    let baseQuery = 'SELECT * FROM products';  // Default query
    const conditions = [];
    const values = [];

    // If category filter is provided
    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    // If maxPrice filter is provided
    if (maxPrice) {
      values.push(maxPrice);
      conditions.push(`price <= $${values.length}`);
    }

    // Append filters to query if present
    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    // Execute the query
    const result = await pool.query(baseQuery, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
