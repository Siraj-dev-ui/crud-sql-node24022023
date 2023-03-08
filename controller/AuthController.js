const Db = require('../services/dbOperations');
const jwt = require('jsonwebtoken');
exports.signup = async (req, res) => {
  const { email, password, cnic } = req.body;
  try {
    let query = `insert into signup values('${email}', '${password}', '${cnic}')`;

    const data = await Db.insertUpdateDelete(query);
    console.log('data that returned : ', data);
    res.json({
      success: true,
      message: 'signup successfully...',
      payload: data,
    });
  } catch (err) {
    res.json({ success: false, message: 'signup failed...' });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let query = `select * from signup where Email='${email}' and password='${password}'`;
    const data = await Db.getRecord(query);
    if (data.length > 0) {
      const token = jwt.sign(
        {
          data: { _id: data[0].ID },
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '2h',
        }
      );

      // method 1
      res.set('Authorization', `Bearer ${token}`);

      // method 2
      res.header('auth-token', token).json({ success: true, payload: data[0] });
    } else {
      res.json({ success: false, message: 'Incorrect email or password...' });
    }
  } catch (err) {
    res.json({ success: false, message: 'error while logging in...' });
  }
};
