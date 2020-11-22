'use strict';

var express = require('express');
var contactController = require('../controllers/contact.controller');

var api = express.Router();

api.post('/saveContact', contactController.saveContact);
api.get('/getContacts', contactController.getContacts);
api.delete('/deleteContact/:id', contactController.deleteContact);
api.put('/updateContact/:id', contactController.updateContact);
api.get('/getContactByPhone', contactController.getContactByPhone);
module.exports = api;