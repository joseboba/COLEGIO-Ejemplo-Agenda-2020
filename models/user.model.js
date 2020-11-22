'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    phone: Number,
    contacts: [{
        name: String,
        lastname: String,
        phone: Number,
        email: String
    }]
});

module.exports = mongoose.model('user', userSchema );