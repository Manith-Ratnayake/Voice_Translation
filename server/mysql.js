import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();  // Load environment variables from .env file

let connection;

// Function to start connection
const startConnection = () => {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject('Error connecting to MySQL database: ' + err);
      } else {
        resolve('Connected to MySQL database');
      }
    });
  });
};

// Function to search people
const searchPeople = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM USERS', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Function to close connection
const closeConnection = () => {
  connection.end();
  console.log('Connection is closed');
};

export { startConnection, searchPeople, closeConnection };


/*
require('dotenv').config();  // Load environment variables from .env file
const mysql = require('mysql2');

// Use environment variables from .env file



let connection;

// Function to start connection
function startConnection() {

    connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });


  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject('Error connecting to MySQL database: ' + err);
      } else {
        resolve('Connected to MySQL database');
      }
    });
  });
}

// Function to search people
function searchPeople() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM USERS', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Function to close connection
function closeConnection() {
  connection.end();
  console.log('Connection is closed');
}

module.exports = { startConnection, searchPeople, closeConnection };
