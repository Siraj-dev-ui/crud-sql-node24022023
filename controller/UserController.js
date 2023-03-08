const DB = require('../services/dbOperations');
exports.addUser = (req, res) => {
  try {
    let user = { ...req.body };
    Db.addUser(user).then((data) => {
      response
        .status(201)
        .json(data ? 'user added successfully...' : 'user not added...');
    });
  } catch (err) {
    res.json({ success: false, message: err });
  }
};
exports.getUsers = (req, res) => {};
exports.updateUser = (req, res) => {};
exports.deleteUser = (req, res) => {};
