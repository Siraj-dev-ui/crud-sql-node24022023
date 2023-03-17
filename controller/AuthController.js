const Db = require('../services/dbOperations');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const randomstring = require('randomstring');
const nodemailer = require('nodemailer');

const { log } = console;

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

const secret = 'my_secret_key';
const algorithm = 'aes-256-cbc';

const encrypt = (payload, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload)),
    cipher.final(),
  ]);
  return {
    iv: iv.toString('base64'),
    data: encrypted.toString('base64'),
  };
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let query = `select * from signup where Email='${email}' and password='${password}'`;
    const data = await Db.getRecord(query);
    if (data.length > 0) {
      const encryptionKey = crypto.randomBytes(32);
      const encryptedPayload = encrypt(data, encryptionKey);

      // encrypted token

      const token = jwt.sign(
        {
          encrypted_payload: encryptedPayload,
        },
        secret,
        { algorithm: 'HS256' }
      );

      // simpel token

      // const token = jwt.sign(
      //   {
      //     data: { _id: data[0].ID },
      //   },
      //   process.env.SECRET_KEY,
      //   {
      //     expiresIn: '2h',
      //   }
      // );

      // method 1
      // res.set('Authorization', `Bearer ${token}`);

      // method 2
      // res.header('auth-token', jwe).json({ success: true, payload: data[0] });
      res.header('auth-token', token).json({ success: true, payload: data[0] });
    } else {
      res.json({ success: false, message: 'Incorrect email or password...' });
    }
  } catch (err) {
    res.json({ success: false, message: err });
  }
};

// reseting password...

const config = {
  user: 'userdummy105@gmail.com',
  pass: 'aoxunossxmgmgwdp',
};

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.user,
    pass: config.pass,
  },
});
const sendResetPasswordMail = async (token) => {
  await transport
    .sendMail({
      from: config.user,
      to: 'sirajalig86@gmail.com',
      subject: 'Please confirm your account',
      html: `<p> click this link to reset your password <a href='http://127.0.0.1:8080/auth/resetPassword/${token}'>click here</a></p>`,
    })
    .catch((err) => console.log(err));
};
exports.forgotPassword = async (req, res) => {
  try {
    console.log('reseting password : ', req.body);
    let query = `select top 1 * from Users where Email='${req.body.email}'`;

    const data = await Db.getRecord(query);
    log('data is : ', data);
    if (data.length > 0) {
      const token = randomstring.generate();
      query = `update Users set token = '${token}' where Email='${req.body.email}'`;
      await Db.insertUpdateDelete(query);
      // log('token generated : ', token);
      sendResetPasswordMail(token);
      res.json({ success: true, payload: token });
    } else {
      res.json({
        success: false,
        message: 'Email Does not exist...',
      });
    }
  } catch (err) {
    res.json({ success: false, message: 'error while reseting password...' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    console.log('updating password password : ', req.params.token);

    let query = `update Users set password='newdd' where token='${req.params.token}'`;

    const data = Db.insertUpdateDelete(query);
    if (data > 0) {
      res.json({ success: true, payload: 'password changed successfully...' });
    }
    // console.log('data against token : ', token, 'data is : ', data);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};
