'use strict'

var path = require('path');
var fs = require('fs');

function checkErrors(err, res, entity, action, entityName){
    if(err){
        res.status(500).send({
            message: 'Error al ' + action + ' ' + entityName
        });
    } else {
        if(!entity){
            res.status(404).send({
                message: 'No se ha podido ' + action + ' ' + entityName
            });                
        } else {
            res.status(200).send({ entityName: entity });    
        }
    } 
}

function uploadImage(req,res,entity,entityName){
    var entityId = req.params.id;
    var file_name = 'No subido';
    
    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');     // divido el nombre en un arreglo
        var file_name = file_split[2];              // tomo el elemento 2
        var ext_split = file_name.split('\.')[1];   // extension del archivo
        
        if (ext_split == 'png' || ext_split == 'jpg' || ext_split == 'jpeg'){
            entity.findByIdAndUpdate(entityId, {image: file_name}, (err, entityUpdated) => {
                if(!entityUpdated){
                    res.status(404).send({
                        message: 'No se ha podido actualizar ' + entityName
                    });                
                } else {
                    res.status(200).send({ 
                        entity: entityUpdated,
                        image: file_name
                    });    
                }
            });
        } else {
            res.status(200).send({
                message: 'Extensión de archivo no válida'
            }); 
        }
        
    } else {
        res.status(200).send({
            message: 'No has subido ninguna imagen'
        });      
    }
    console.log();
    
}

function uploadFile(req,res,entity,entityName){
    var entityId = req.params.id;
    var file_name = 'No subido';
    
    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\/');     // divido el nombre en un arreglo
        var file_name = file_split[2];              // tomo el elemento 2
        var ext_split = file_name.split('\.')[1];   // extension del archivo
        
        if (ext_split == 'mp3' || ext_split == 'ogg' ){
            entity.findByIdAndUpdate(entityId, {file: file_name}, (err, entityUpdated) => {
                if(!entityUpdated){
                    res.status(404).send({
                        message: 'No se ha podido actualizar ' + entityName
                    });                
                } else {
                    res.status(200).send({ entity: entityUpdated });    
                }
            });
        } else {
            res.status(200).send({
                message: 'Extensión de archivo no válida'
            }); 
        }
        
    } else {
        res.status(200).send({
            message: 'No has subido ninguna canción'
        });      
    }
    
}

function getImageFile(req,res,entityName){
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/'+entityName+'/' + imageFile;
    
    fs.exists(pathFile, function(exists){
        if (exists){
            res.sendFile(path.resolve(pathFile));   
        } else {
            res.status(200).send({
                message: 'No existe la imagen'
            });   
        }
        
    });
    
}

function getSongFile(req,res,entityName){
    var songFile = req.params.songFile;
    var pathFile = './uploads/'+entityName+'/' + songFile;
    
    fs.exists(pathFile, function(exists){
        if (exists){
            res.sendFile(path.resolve(pathFile));   
        } else {
            res.status(200).send({
                message: 'No existe el fichero de audio'
            });   
        }
        
    });
    
}

function getEntities(req,res,entity,entitiesName,sortedBy){
    
    if(req.params.page){
        var page = req.params.page;   
    } else {
       var page = 1;
    }
        
    var itemsPerPage = 5;
    
    entity.find().sort(sortedBy).paginate(page, itemsPerPage, function(err, entities, total){
        checkErrors(err, res, entities, 'listar', entitiesName);         
    });
    
}

module.exports = {
    uploadImage,
    getImageFile,
    checkErrors,
    getEntities,
    getSongFile,
    uploadFile
    
};