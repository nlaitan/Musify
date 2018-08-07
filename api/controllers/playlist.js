'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Utils = require('../utils/utils');

var Playlist = require('../models/playlist');

//var Album = require('../models/album');
var Song = require('../models/song');

function getPlaylist(req,res){
    
    var playlistId = req.params.id;
    Playlist.findById(playlistId).populate({path: 'user'}).exec((err,playlist)=>{
        Utils.checkErrors(err,res,playlist,'obtener','playlist');
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
    var playlistId = req.params.playlist;
    
    if(!playlistId){
        var find = Playlist.find({}).sort('title');
    } else {
        var find = Playlist.find({playlist: playlistId}).sort('title');    
    }
    
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
        res.status(200).send({ message: 'Playlist borrada exitosamente' });  
    });
}

/*
function getPlaylistSongs(req,res){
    var playlistId = req.params.playlist;
    var find;
    !playlistId ?
        (find = Song.find({}).sort('number')) :
        (find = Song.find({playlists: playlistId}).sort('name'));    
    
    find.populate({
        path: 'playlist',                                  // matcheo playlists
        populate: { path: 'artist', model: 'Artist' }       // vuelvo a matchear artistas
    }).exec((err, songs) => {
        Utils.checkErrors(err, res, songs, 'listar', 'canciones de playlist')
    });
    
}
*/

function addSong(req,res){
    var playlistId = req.params.id;     // Bien recibido
    var songId = req.body.song;         // Bien recibido
    Playlist.findByIdAndUpdate(playlistId, 
        {$push: {songs: songId}},
        function(err, doc) {
            err ? console.log(err) :
            res.status(200).send({ message: 'Cancion agregada exitosamente' }) 
        }  
    );   
}


function uploadImage(req,res){
    Utils.uploadImage(req, res, Playlist, 'playlist');
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
    //getPlaylistSongs,
    addSong

};