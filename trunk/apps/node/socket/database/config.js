const Pool = require('pg').Pool
require('dotenv').config();

const pool = new Pool({
   host:process.env.HOSTDB,
   database:process.env.DBNAME,
   port: process.env.PORTDB,
   user:process.env.USERDB,
   password: process.env.CONTRASENIA
});

module.exports = pool