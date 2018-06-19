const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "YOUR_USERNAME_HERE",
  password: "YOUR_PASSWORD_HERE", // if none, remove this line
  database: "shop_reviews"
});

module.exports = connection;
