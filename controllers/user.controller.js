'use strict';
var User = require('../models/user.model');
var mongoose = require('mongoose');
var Contact = require('../models/contact.model');
mongoose.set('useFindAndModify', false);


function saveUser(req, res){
    var user = new User();
    var params = req.body;
        if(params.name && params.lastname && params.email && params.username && params.password){
            User.findOne({username: params.username}, (err, userFind) => {
                if(err){
                    res.status(500).send({message: 'Error del servidor', err});
                }else if(userFind){
                    res.status(200).send({message: 'Este usuario ya fue creado'});
                }else{
                    user.name = params.name;
                    user.lastname = params.lastname;
                    user.email = params.email;
                    user.username = params.username;
                    user.password = params.password;
                    
                    user.save((err, userSaved) =>{
                        if(err){
                            res.status(500).send({message: 'Error en el servidor, intente más tarde'});
                        }else{
                            if(userSaved){
                                res.status(200).send({user: userSaved});
                            }else{
                                res.status(200).send({message: 'Usuario no guardado'});
                            }
                        }
                    })
                }
            });
        }else{
            res.status(200).send({message: 'Ingrese los datos requeridos'});
            }
} 
   
        

function getUsers(req, res){
    User.find({}).exec((err, users) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(users){
                res.status(200).send({users: users})
            }else{
                res.status(200).send({message: 'No hay registros'});
            }
        }
    });
}

function getUser(req, res){
    var userId = req.params.id;

    User.findById(userId).exec((err, user) =>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else{
            if(user){
                res.status(200).send({user: user});
            }else{
                res.status(404).send({message: 'El usuario no existe'});
            }
        }
    })
}


function updateUser(req, res){
    let userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update,{new: true}, (err, userUpdate)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else{
            if(userUpdate){
                res.status(200).send({user: userUpdate});
            }else{
                res.status(404).send({message: 'No se actualizó'})
            }
        }
    })
}

function deleteUser(req, res){
    let userId = req.params.id;

    User.findByIdAndRemove(userId, (err, userRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else{
            if(userRemoved){
                res.status(200).send({user: 'El usuario fue eliminado'});
            }else{
                res.status(404).send({message: 'No existe este usuario'})
            }
        }
    })
}

function login(req, res){
    let userParams = req.body;
    
    if( userParams.email && userParams.password ){
    User.findOne({email: userParams.email, password:userParams.password}, (err, userFound) => {
        if(err){
            res.status(500).send({message: ''})
        }else if(userFound){
            res.status(200).send({message: 'Bienvenido a su cuenta: ', userFound});
        }else{
            res.status(404).send({message: 'Contraseña o correo incorrecto'});
        }
    })
   }else{
        res.status(404).send({message:'Ingrese la correo o contraseña'});
    }
}


/* FUNCIONES USER-CONTACTS (Documentos Embedidos)*/

function setContact(req, res){
    let userId = req.params.id;
    let paramsContact = req.body;
    let contact = new Contact();

    User.findById(userId, (err, userFound) => {
        if(err){
            res.status(500).send({message:'El usuario no existe'});
        }else if(userFound){
            if(paramsContact.name, paramsContact.phone){
                contact.name = paramsContact.name;
                contact.lastname = paramsContact.lastname;
                contact.phone = paramsContact.phone;
                contact.email = paramsContact.email;
                
                User.findByIdAndUpdate(userId,  {$push:{contacts: contact}}, {new: true}, (err, userUpdated) => {
                    if(err){
                        res.status(500).send({message: 'Error en el servidor'});
                    }else if(userUpdated){
                        res.status(200).send({message: 'El siguiente contacto ha sido agregado', userUpdated});
                    }else{
                        res.status(404).send({message: 'El usuario no se ha agregado'});
                    }
                })
            }else{
                res.status(200).send({message: 'Ingrese los datos minimos para agregar un cotacto'});
            }
        }else{
            res.status(404).send({message: 'El usurio no existe'});
        }
    })
    
}

function updateContact(req, res){
    let userId = req.params.idU;
    let contactId = req.params.idC;
    let update = req.body;

    User.findOne({_id:userId} , (err, userFound) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(userFound){
            if(update.name){
                User.findOneAndUpdate({_id: userId, "contacts._id": contactId},
                {"contacts.$.name": update.name},
                {new: true},
                (err, contactUpdated) => {
                    if(err){
                        res.status(500).send({message:'Error general'});
                    }else if(contactUpdated){
                        res.status(200).send({message: 'El contacto actualizado es: ', contactUpdated});
                    }else{
                        res.status(404).send({message:'El usuario no existe'});
                    }
                })
            }
           /* User.findOneAndUpdate({_id:userId, "contacts._id": contactId},
            {"contacts.$.name": update.name,
            "contacts.$.lastname": update.lastname,
            "contacts.$.phone": update.phone,
            "contacts.$.email": update.email},
            {new: true},
            (err, contactUpdated) => {
                if(err){
                    res.status(500).send({message:'Error en el servidor'});
                }else if(contactUpdated){
                    res.send({contact: contactUpdated}); //Codigo 200 implicito en el res 
                }else{ 
                    res.status(404).send({message:'Contacto no actualizado'});
                }
            });*/
        }else{
            res.status(404).send({message: 'Ingrese los datos solicitados'});
            }     
    });
}

function removeContact(req, res){
    let userId = req.params.idU;
    let contactId = req.params.idC;

    User.findOneAndUpdate({_id: userId, "contacts._id": contactId}, {$pull:{contacts:{_id:contactId}}}, {new: true}, (err, userUpdated) => {
        if(err){
            res.status(500).send('Error general');
        }else if(userUpdated){
            res.status(200).send({user: userUpdated});
        }else{
            res.status(404).send({message: 'Usuario no encontrado'});
        }
    });

}



module.exports = {
    saveUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    setContact,
    updateContact,
    removeContact,
    login   
};