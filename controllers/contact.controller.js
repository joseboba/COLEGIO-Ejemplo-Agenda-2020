'use strict';

var Contact = require('../models/contact.model');
var mongoose = require('mongoose');

function saveContact(req, res){
    var contact = new Contact();
    var params = req.body;

    if(params.name && params.phone){
        contact.name = params.name;
        contact.lastname = params.lastname;
        contact.phone = params.phone;
        contact.email = params.email;

        contact.save((err, contactSaved) => {
            if(err){
                res.status(500).send({message: 'Error en el servidor'})
            }else if(contactSaved){
                res.status(200).send({message: 'Se ha creado el contacto', contactSaved})
            }else{
                res.status(404).send({message: 'No se ha guardado el contacto'})
            }
        });
    }else{
        res.status(500).send({message: 'Ingrese los datos requeridos'});
    }
}

function getContacts(req, res){
    Contact.find({}).exec((err, contacts) => {   
         if(err){
            res.status(500).send({message: 'Error en  el servidor'});
        }else if(contacts){
            res.status(200).send({contactos: contacts});
        }else{
            res.status(200).send({message: 'No hay contactos'});
        }
    }); 
}

function deleteContact(req, res){
    let contactId = req.params.id;
    Contact.findByIdAndRemove(contactId, (err, contactRemoved) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(contactRemoved){
            res.status(200).send({message: 'El siguiente usuario fue eliminado:', contactRemoved});
        }else{
            res.status(500).send({message: 'Ese usuario ya fue eliminado'});
        }
    })
}

function updateContact(req, res){
    let contactId = req.params.id;
    var change = req.body;

    Contact.findByIdAndUpdate(contactId, change, {new: true},(err, contactUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(contactUpdated){
            res.status(200).send({message: 'El siguiente contacto fue actualizado:', contactUpdated});
        }else{
            res.status(404).send({message: 'El contacto no existe'});
        }
    });
}

function getContactByPhone(req, res){
    var phone = req.body;
    Contact.findOne(phone, (err, contactFound) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(contactFound){
            res.status(200).send({message: 'El siguiente contacto fue encontrado:', contactFound});
        }else{
            res.status(200).send({message: 'El contacto buscado no existe'})
        }
    })
}

module.exports = {
    saveContact,
    getContacts,
    deleteContact,
    updateContact,
    getContactByPhone
};