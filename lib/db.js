import mysql from 'mysql2/promise';

//Creates a reusable connection to local MySQL Workbench database
//Configured with proper credentials in order to access solitaire.db
const pool = mysql.createPool({
  //Database credentials
  host: 'localroot',
  user: 'root',
  password: 'password123',
  //Targeted schema
  database: 'solitaire_db',
  //Other connection settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

