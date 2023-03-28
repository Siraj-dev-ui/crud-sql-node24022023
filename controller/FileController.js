exports.uploadFile = async (req, res) => {
  console.log('file to be upload : ', req.file);
  req.file
    ? res.json({ success: true })
    : res.json({ success: false, message: req.fileValidationError });
};
