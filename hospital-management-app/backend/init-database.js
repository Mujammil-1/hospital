const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function initializeDatabase() {
  const connection = mysql.createConnection(dbConfig);
  
  try {
    console.log('Connecting to MySQL...');
    
    // Read the SQL file
    const sqlFile = fs.readFileSync(path.join(__dirname, 'init-db.sql'), 'utf8');
    
    // Split by delimiter and execute each statement
    const statements = sqlFile.split('$$').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing statement...');
        await connection.promise().execute(statement);
      }
    }
    
    console.log('Database initialized successfully!');
    console.log('HospitalDB database created with all tables, data, procedures, triggers, and views.');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    connection.end();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;