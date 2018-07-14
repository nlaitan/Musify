'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req,res){
    res.status(200).send({
        message:'Probando el contrlador'
    });
}

function saveUser(req,res){
    var user = new User();
    
    var params = req.body;
    
    console.log(params);
    
    user.name = params.name;
    user.lastname = params.lastname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';
    
    if(params.password){
        // encriptar contraseña
        bcrypt.hash(params.password, null, null, function(err,hash){
            user.password = hash;
            if(user.name != null && user.lastname != null && user.email != null){
               // guardar usuario
                user.save((err, userStored) => {
                   if(err){
                       res.status(200).send({
                            message: 'Error al guardar usuario'
                        });            
                    } else {
                        if(!userStored){
                            res.status(404).send({
                                message: 'No se ha registrado el usuario'
                            });   
                        } else {
                            res.status(200).send({user: userStored});
                        }
                    } 
                });
            } else {
                res.status(200).send({
                    message: 'Complete todos los campos'
                }); 
            }
        })
    } else {
        res.status(500).send({
            message: 'Introduce la contraseña'
        });
    }
    
    
}

function loginUser(req, res){
    var params = req.body;
    
    var email = params.email;
    var password = params.password;
    
    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if(!user){
                res.status(404).send({
                    message: 'El usuario no existe'
                });   
            } else {
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        // devolver datos de usuario logueado
                        if(params.gethash){
                            // devolver token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)   
                            });
                        } else {
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({
                           message: 'El usuario no ha podido loguearse' 
                        });
                    }
                });
            }
        } 
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;
    
    User.findByIdAndUpdate(userId, update, (err, userUpdated)=>{
        if(err){
            res.status(500).send({
                message: 'Error al actualizar el usuario'
            });
        } else {
            if(!userUpdated){
                res.status(404).send({
                    message: 'No se ha podido actualizar el usuario'
                });                
            } else {
                res.status(200).send({ user: userUpdated });    
            }
        }
        
    });
}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido';
    
    if(req.files){
        var file_path = req.files.image.path;
        
        console.log(file_path);
    } else {
        res.status(200).send({
            message: 'No has subido ninguna imagen'
        });      
    }
    
}


module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser
};




