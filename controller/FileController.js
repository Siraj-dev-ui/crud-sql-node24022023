exports.uploadFile = async (req, res) => {
  console.log('file request data : ', req.fileValidationError);
  req.file
    ? res.json({ success: true })
    : res.json({ success: false, message: req.fileValidationError });
  // res.json({ req.file ?  success: true: '' });
};
