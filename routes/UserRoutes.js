const express = require('express');
const routes = express.Router();
const controller = require('../controller/UserController');

routes.get('/users', controller.getUsers);

module.exports = routes;
