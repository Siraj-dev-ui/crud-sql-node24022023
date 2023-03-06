require('dotenv').config();
const config = {
  // user: 'siraj', // sql user
  user: process.env.DB_USER, // sql user
  password: process.env.DB_PASSWORD, //sql user password
  server: process.env.SERVER, // if it does not work try- localhost
  database: process.env.DB,
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    instancename: 'SQLEXPRESS', // SQL Server instance name
    encrypt: false,
    trustServerCertificate: true,
  },
  // port: process.env.PORT,
  port: 1433,
};

module.exports = config;
