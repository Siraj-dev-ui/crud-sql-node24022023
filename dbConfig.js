const config = {
  user: 'siraj', // sql user
  password: '123', //sql user password
  server: '127.0.0.1', // if it does not work try- localhost
  database: 'Crud',
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    instancename: 'SQLEXPRESS', // SQL Server instance name
    encrypt: false,
    trustServerCertificate: true,
  },
  port: 1433,
};

module.exports = config;
