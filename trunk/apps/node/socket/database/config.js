const Pool = require('pg').Pool
//require('dotenv').config({ quiet: true });

const pool = new Pool({
   host:process.env.HOSTDB,
   database:process.env.DBNAME,
   port: process.env.PORTDB,
   user:process.env.USERDB,
   password: process.env.CONTRASENIA,
   options: process.env.OPTIONS
});

module.exports = pool