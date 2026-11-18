import mysql from 'mysql2/promise';

//Creates a reusable connection to local MySQL Workbench database
//Configured with proper credentials in order to access solitaire_db
const pool = mysql.createPool({
  //Database credentials
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  //Targeted schema
  database: process.env.DB_NAME || 'solitaire_db',
  //Other connection settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;