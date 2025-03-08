import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();  

export const mydb = {
  connection: null,

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



  async searchPeople(userID) {

    try{
      const [rows, fields] = await this.connection.promise().query("SELECT userID FROM USERS WHERE userID = ? ",[userID])
      return rows

    } catch(error){
      console.log(error);
    }
  },


  async authenticationSignIn(userID, password) {
    
    
    try{
      const [rows, fields] = await this.connection.promise().query("SELECT userID FROM USERS WHERE userID = ? AND password = ? ",[userID, password])

      if (rows.length > 0)  {
        return true
      } else {
        return false
      }


    } catch(error){
      console.log(error);
    }
  },


  
  async authenticationSignUp(userID, password) {

      try {
        const [rows, fields] = await this.connection.promise().query("SELECT userID FROM USERS WHERE userID = ? AND PASSWORD = ?", [userID, password])

        if (rows.length === 0 ) {
          await this.connection.promise().query("INSERT INTO USERS (userID, password) VALUES (? , ? )", [userID, password])
        }
        

      } catch(error){
        console.log(error)
      };

  }, 


  closeConnection() {

    if(this.connection){
      this.connection.end((err) => {
        
        if (err) {
          console.log('Database Connection is closed');
        }

        else {
          console.log("Database Connection is closed successfully")
        }

      });
    } else {
        console.log("No active daabase connection to close");
    }
  }

};



