const mysql = require("mysql2");

const pool = mysql.createPool({
    host : 'localhost',
    user : "root",
    password : "",
    database : "expensify"
});

module.exports = pool.promise();