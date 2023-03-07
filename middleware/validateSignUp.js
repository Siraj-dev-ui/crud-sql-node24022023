exports.validate = (req, res, next) => {
  console.log('values to validate for signup : ', req.body);
  return res.json({ success: false, message: 'invalid email or password...' });
  next();
  console.log('after next');
};
