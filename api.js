var Db = require('./dboperations');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

// add user
router.route('/users').post((request, response) => {
  console.log('adding user to db : ', request.body);
  let user = { ...request.body };
  Db.addUser(user).then((data) => {
    response.status(201).json(data);
  });
});

// get User
router.route('/users').get((request, response) => {
  Db.getUsers().then((data) => {
    response.json(data[0]);
  });
});

// delete user
router.delete('/deleteuser/:userId', (request, response) => {
  try {
    Db.deleteUser(request.params.userId).then((data) => {
      response.json(data[0]);
    });
  } catch (err) {
    response.json({ success: false, message: err });
  }
});

router.patch('/updateuser/:userId', (req, res) => {
  try {
    Db.updateUser(req.params.userId, req.body).then((success) => {
      if (success) {
        res.json({ success: success, message: 'user updated successfully...' });
      } else {
        res.json({ success: success, message: 'user not updated...' });
      }
    });
  } catch (err) {
    res.json({ success: false, errorMessage: err });
  }
});

router.use((request, response, next) => {
  console.log('middleware');
  next();
});

var port = process.env.PORT || 8090;
app.listen(port);
console.log('API is runnning at ' + port);
