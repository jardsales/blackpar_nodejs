// Arquivo de conexão com o banco

mysql = require("mysql")
require('dotenv').config()

pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
})

module.exports = pool