// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://cmps262_module_3_part_2_user:s33YNM1qb8OI69r8LiabM1HMzwDXUYsh@dpg-cvpfikngi27c73b545og-a.ohio-postgres.render.com/cmps262_module_3_part_2',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
