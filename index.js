'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/Ejemplo2020',{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('Success');
        app.listen(port, ()=>{
            console.log('El servidor esta corriendo en el puerto:', port);
        }); 
    })
    .catch( err=>{
        console.log('No se ha conectado', err);
        });
