const express = require('express');
const routes = express.Router();
const controller = require('../controller/AuthController');
const validateSignUp = require('../middleware/validateSignUp');

routes.post('/signup', validateSignUp.validate, controller.signup);
routes.post('/login', controller.login);
routes.get('/test', (req, res) => {
  res.json({ message: 'tested...' });
});

module.exports = routes;
