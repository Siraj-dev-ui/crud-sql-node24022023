exports.uploadFile = async (req, res) => {
  console.log('file request data : ', req.file);
  req.file
    ? res.json({ success: true })
    : res.json({ success: false, message: 'invalid file type' });
  // res.json({ req.file ?  success: true: '' });
};
