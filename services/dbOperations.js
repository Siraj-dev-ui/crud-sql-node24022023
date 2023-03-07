var config = require('../config/dbConfig');
const sql = require('mssql');

async function getUsers() {
  try {
    let pool = await sql.connect(config);
    let products = await pool.request().query('SELECT * from Users');
    return products.recordsets;
  } catch (error) {
    console.log('error in sql : ', error);
  }
}

async function addUser(user) {
  console.log('starting db operations...');
  console.log('user to add is : ', user);
  try {
    let pool = await sql.connect(config);
    console.log('connection successfull...');

    const { Name, Email, Password, PasswordHash, DateOfBirth, Age, Gender } =
      user;

    let insertUser = await pool
      .request()
      .input('name', sql.VarChar, Name)
      .input('email', sql.VarChar, Email)
      .input('password', sql.VarChar, Password)
      .input('passwordhash', sql.VarChar, PasswordHash)
      .input('dateofbirth', sql.VarChar, DateOfBirth)
      .input('age', sql.Int, Age)
      .input('gender', sql.VarChar, Gender)
      .query(
        `insert into users (name,email, password,passwordhash,dateofbirth,age,gender) values (@name,@email,@password,@passwordhash,@dateofbirth,@age,@gender)`
      );

    // return insertUser.recordsets;
    return true;
  } catch (err) {
    console.log(err);
  }
}

async function deleteUser(UserId) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input('input_parameter', sql.Int, UserId)
      .query('DELETE from Users where Id = @input_parameter');
    return true;
  } catch (error) {
    console.log(error);
  }
}

// updating user

async function updateUser(UserId, UserData) {
  try {
    let query = '';
    const keys = Object.keys(UserData);
    const values = Object.values(UserData);

    for (let i = 0; i < keys.length; i++) {
      query += keys[i] + `='` + values[i] + `',`;
    }
    query = query.substring(0, query.length - 1);

    let pool = await sql.connect(config);
    await pool.query(`update users set  ${query} where id = '${UserId}'`);
    return true;
  } catch (error) {
    console.log('error while updating record...');
    return false;
  }
}

async function insertUpdateDelete(query) {
  let pool = await sql.connect(config);
  const data = await pool.query(query);
  console.log('insert/update/delete result : ', data.rowsAffected[0]);
  return data;
}

async function getRecord(query) {
  let pool = await sql.connect(config);
  const data = await pool.query(query);
  console.log('data to return on get request : ', data);
  return data.recordset;
}

module.exports = {
  addUser: addUser,
  getUsers: getUsers,
  deleteUser: deleteUser,
  updateUser: updateUser,
  insertUpdateDelete,
  getRecord,
};
