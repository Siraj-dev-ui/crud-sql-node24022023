var Db = require('./dboperations');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'node js api endpoint',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8080/',
      },
    ],
  },
  apis: [`./api.js`],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// add user
router.route('/users').post((request, response) => {
  console.log('adding user to db : ', request.body);
  let user = { ...request.body };
  Db.addUser(user).then((data) => {
    response.status(201).json(data);
  });
});

/**
 * @swagger
 * /api:
 *  get:
 *      summary: this is summary
 *      description: this is api description
 *      responses:
 *          200:
 *              description: description to test get method
 */
router.route('/').get((request, response) => {
  response.send('welcome to mongo db api...');
});

// "ID": "1",
//         "Name": "siraj",
//         "Email": "sirajalig@gmail.com",
//         "Password": "123",
//         "PasswordHash": "123hashed",
//         "DateOfBirth": "1-10-1998",
//         "Age": 25,
//         "Gender": "Male"

/**
 * @swagger
 * components:
 *    schema:
 *        User:
 *            type: object
 *            properties:
 *                ID:
 *                    type: integer
 *                Name:
 *                    type: string
 *                Email:
 *                    type: string
 *                Password:
 *                    type: string
 *                PasswordHash:
 *                    type: string
 *                DateOfBirth:
 *                    type: string
 *                Age:
 *                    type: integer
 *                Gender:
 *                    type: string
 */
/**
 * @swagger
 * /api/users:
 *  get:
 *      summary: Getting all users
 *      description: this api is used to get user data from database
 *      responses:
 *          200:
 *              description: this api is used to get user data from database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/User'
 */
router.route('/users').get((request, response) => {
  Db.getUsers().then((data) => {
    response.status(200).json(data[0]);
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

// swagger

// var port = process.env.PORT || 8090;
var port = 8080;
app.listen(port);
console.log('API is runnning at ' + port);
