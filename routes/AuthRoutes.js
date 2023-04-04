const express = require('express');
const app = express();
const routes = express.Router();
const controller = require('../controller/AuthController');
const validateSignUp = require('../middleware/validateSignUp');

/**
 * @swagger
 * components:
 *    schemas:
 *        SignUp:
 *            type: object
 *            properties:
 *                ID:
 *                    type: integer
 *                email:
 *                    type: string
 *                password:
 *                    type: string
 *                confirmPassword:
 *                    type: string
 *                cnic:
 *                    type: string
 */

/**
 * @swagger
 * /auth/signup:
 *  post:
 *      summary: Register User
 *      description: this api will register new user...
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                   schema:
 *                       $ref: '#components/schemas/SignUp'
 *
 *      responses:
 *          200:
 *              description: user added successfully...
 */
routes.post('/signup', validateSignUp.validate, controller.signup);

/**
 * @swagger
 * components:
 *    schemas:
 *        Login:
 *            type: object
 *            properties:
 *                email:
 *                    type: string
 *                password:
 *                    type: string
 */

/**
 * @swagger
 * /auth/login:
 *  post:
 *      security:
 *        - bearerAuth: []
 *      summary: Login User
 *      description: This api will login user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                   schema:
 *                       $ref: '#components/schemas/Login'
 *
 *      responses:
 *          200:
 *              description: user added successfully...
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/SignUp'
 */
routes.post('/login', controller.login);
routes.post('/forgotPassword', controller.forgotPassword);
routes.get('/resetPassword/:token', controller.resetPassword);
routes.get('/test', (req, res) => {
  res.json({ message: 'tested...' });
});

module.exports = routes;
