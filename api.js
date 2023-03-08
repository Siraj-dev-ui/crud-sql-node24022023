var Db = require('./services/dbOperations');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoute = require('./routes/UserRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use('/api', router);

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

/**
 * @swagger
 * components:
 *    schemas:
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
 *  post:
 *      summary: Adding user
 *      description: this api is used to add user data to database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                   schema:
 *                       $ref: '#components/schemas/User'
 *
 *      responses:
 *          200:
 *              description: user added successfully...
 */
// add user
router.route('/users').post((request, response) => {
  let user = { ...request.body };
  Db.addUser(user).then((data) => {
    response
      .status(201)
      .json(data ? 'user added successfully...' : 'user not added...');
  });
});

router.post('/users');

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
 *                              $ref: '#components/schemas/User'
 */

// get users
router.route('/users').get((request, response) => {
  Db.getUsers().then((data) => {
    response.status(200).json(data[0]);
  });
});

// update data

/**
 * @swagger
 * /api/updateuser/{userId}:
 *  patch:
 *      summary: Adding user
 *      description: this api is used to add user data to database
 *      parameters:
 *          - in: path
 *            name: userId
 *            required: true
 *            description: Numeric ID required
 *            schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                   schema:
 *                       $ref: '#components/schemas/User'
 *      responses:
 *          200:
 *              description: user added successfully...
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/User'
 */

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

/**
 * @swagger
 * /api/deleteuser/{userId}:
 *  delete:
 *      summary: Delete User
 *      description: this api is used to delete user data from database
 *      parameters:
 *          - in: path
 *            name: userId
 *            required: true
 *            description: Numeric ID required
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: data is deleted
 */

// delete user
router.delete('/deleteuser/:userId', (request, response) => {
  try {
    Db.deleteUser(request.params.userId).then((data) => {
      response.json({ success: true, message: 'User deleted successfully...' });
    });
  } catch (err) {
    response.json({ success: false, message: err });
  }
});

router.use((request, response, next) => {
  console.log('middleware');
  next();
});

app.use('/api', userRoute);

// swagger

// var port = process.env.PORT || 8090;
var port = 8080;
app.listen(port);
console.log('API is runnning at ' + port);
