'use strict';

var express = require('express');
var userController = require('../controllers/user.controller');

var api = express.Router();

api.post('/saveUser', userController.saveUser);
api.get('/getUsers', userController.getUsers);
api.get('/getUser/:id', userController.getUser);
api.put('/updateUser/:id', userController.updateUser);
api.delete('/deleteUser/:id', userController.deleteUser);
api.get('/login', userController.login);

/* RUTAS USER-CONTACT */
api.put('/setContact/:id', userController.setContact);
api.put('/updateContact/:idU/:idC', userController.updateContact);
api.put('/removeContact/:idU/:idC', userController.removeContact);
module.exports = api;