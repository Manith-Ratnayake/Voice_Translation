import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();  


const mydb = {
  connection: null,

  // Function to start connection
  startConnection() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          reject('Error connecting to MySQL database: ' + err);
        } else {
          resolve('Connected to MySQL database');
        }
      });
    });
  },

  // Function to search people
  searchPeople() {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM USERS', (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  // Function to close connection
  closeConnection() {
    this.connection.end();
    console.log('Connection is closed');
  },
};

export default mydb;