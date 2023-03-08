const DB = require('../services/dbOperations');

exports.validate = async (req, res, next) => {
  console.log('values to validate for signup : ', req.body);
  const { email, password, confirmPassword, cnic } = req.body;
  let query = `select * from signup where email='${email}'`;
  let data = await DB.getRecord(query);
  console.log('data for validation : ', data);

  if (data.length > 0) {
    return res.json({ success: false, message: 'email already exists...' });
  }

  query = `select * from signup where cnic='${cnic}'`;
  data = await DB.getRecord(query);

  if (data.length > 0) {
    return res.json({ success: false, message: 'cnic already exists...' });
  }
  if (password !== confirmPassword) {
    return res.json({
      success: false,
      message: 'password and confirm password are not same...',
    });
  }

  next();
  console.log('after next');
};
