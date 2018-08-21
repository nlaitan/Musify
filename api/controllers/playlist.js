'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Utils = require('../utils/utils');

var Playlist = require('../models/playlist');
var Song = require('../models/song');



function getPlaylist(req,res){
    
    var playlistId = req.params.id;
    
    Playlist.findById(playlistId)
    .populate({ path: 'user' })
    .populate({ path: 'songs', select: 'name duration file', 
                populate: { path: 'album', select: 'image', 
                            populate: { path: 'artist', select: 'name' }  
                } 
    })
    .exec((err,playlist)=>{
        err ? (res.status(500).send({ message: 'Error en la petición' })) : 
        !playlist ? res.status(404).send({ message: 'No existe la playlist' }) : 
        (

            res.status(200).send({ playlist })
        ); 
    });
    
}


function savePlaylist(req,res){
    
    var playlist = new Playlist();
    var params = req.body;
    
    playlist.title = params.title;
    playlist.description = params.description;
    playlist.image = 'null';
    playlist.user = params.user;
    playlist.songs = new Array();
    
    playlist.save((err, playlistStored) => {
        Utils.checkErrors(err,res,playlistStored,'guardar','playlist');
    })
    
}


function getPlaylists(req,res){
    var userId = req.params.user;
    var find;
    !userId ? 
        (find = Playlist.find({}).sort('title')) :
        (find = Playlist.find({user: userId}).sort('title'));
    
    find.populate({path: 'user'}).exec((err, playlists) => {
        Utils.checkErrors(err, res, playlists, 'listar', 'playlists')
    });
    
}


function updatePlaylist(req,res){
    var playlistId = req.params.id;
    var update = req.body;
    
    Playlist.findByIdAndUpdate(playlistId, update, (err, playlistUpdated)=>{
        Utils.checkErrors(err,res,playlistUpdated,'actualizar','playlist');        
    });
}


function deletePlaylist(req,res){
    var playlistId = req.params.id;
    
    Playlist.findByIdAndRemove(playlistId, (err, playlistRemoved)=>{
        err ? res.status(500).send({ message: 'Error al borrar la playlist' }) :
        !playlistRemoved ? res.status(404).send({ message: 'No se recibio playlist' }) :     
        res.status(200).send({ playlist: playlistRemoved });  
    });
}


function addSong(req,res){
    var playlistId = req.params.id;     // Bien recibido
    var songId = req.body.song;         // Bien recibido
    Playlist.findByIdAndUpdate(playlistId, 
        {$push: {songs: songId}},       // $push inserta un elemento en el array de songs
        function(err, playlist) {
            err ? res.status(500).send({ message: 'Error en la petición' }) :
            !playlist ? res.status(404).send({ message: 'No existe la playlist' })  :
            res.status(200).send({ message: 'Cancion agregada exitosamente' }) 
        }  
    );   
}

function deleteSong(req,res){
    var playlistId = req.params.id;    
    var songId = req.body._id;
    console.log('songId: ' + songId);
    Playlist.findByIdAndUpdate(playlistId, 
        {$pull: {songs: songId}},       // $pull quita un elemento del array de songs
        function(err, playlist) {
            err ? res.status(500).send({ message: 'Error en la petición' }) :
            !playlist ? res.status(404).send({ message: 'No existe la playlist' })  :
            res.status(200).send({ message: 'Cancion eliminada exitosamente' }) 
        }  
    );   
}


function uploadImage(req,res){
    var playlistId = req.params.id;
    var file_name = 'No subido';
    
    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');     // divido el nombre en un arreglo
        var file_name = file_split[2];              // tomo el elemento 2
        var ext_split = file_name.split('\.')[1];   // extension del archivo
        
        if (ext_split == 'png' || ext_split == 'jpg' || ext_split == 'jpeg') {
            Playlist.findByIdAndUpdate(playlistId, {image: file_name}, (err, playlistUpdated) => {
                err ? res.status(500).send({ message: 'Error en la petición' }) :
                (!playlistUpdated) ? 
                    (res.status(404).send({ message: 'No se ha podido subir la imagen' })) :                
                    (res.status(200).send({ playlist: playlistUpdated, image: file_name }));    
            }) 
        } else {
            res.status(200).send({ message: 'Extensión de archivo no válida' })
        } 
        
    } else {
        res.status(200).send({ message: 'No has subido ninguna imagen' });      
    }
    
}

function getImageFile(req,res){
    Utils.getImageFile(req,res,'playlists');    
}


module.exports = {
    getPlaylist,
    getPlaylists,
    savePlaylist,
    updatePlaylist,
    deletePlaylist,
    uploadImage,
    getImageFile,
    addSong,
    deleteSong

};