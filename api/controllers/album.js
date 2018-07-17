'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Utils = require('../utils/utils');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req,res){
    
    var albumId = req.params.id;
    Album.findById(albumId).populate({path: 'artist'}).exec((err,album)=>{
        Utils.checkErrors(err,res,album,'obtener','álbum');
    });
    
}

function saveAlbum(req,res){
    
    var album = new Album();
    var params = req.body;
    
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;
    
    album.save((err, albumStored) => {
        Utils.checkErrors(err,res,albumStored,'guardar','álbum');
    })
    
}

function getAlbums(req,res){
    var artistId = req.params.artist;
    
    if(!artistId){
        var find = Album.find({}).sort('title');
    } else {
        var find = Album.find({artist: artistId}).sort('year');    
    }
    
    find.populate({path: 'artist'}).exec((err, albums) => {
        Utils.checkErrors(err, res, albums, 'listar', 'álbums')
    });
    
}

function updateAlbum(req,res){
    var albumId = req.params.id;
    var update = req.body;
    
    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{
        Utils.checkErrors(err,res,albumUpdated,'actualizar','álbum');        
    });
}

function deleteSongsOfAlbum(albumRemoved, res){
    Song.find({ album: albumRemoved._id }).remove((err, songRemoved)=>{
        if(err){
            res.status(500).send({
                message: 'Error al borrar la canción'
            });
        } else {
            if(!songRemoved){
                res.status(404).send({
                    message: 'No se ha podido borrar la canción'
                });                
            } else {
                res.status(200).send({ album: albumRemoved });    
            }
        }                    
    });
}

function deleteAlbum(req,res){
    var albumId = req.params.id;
    
    Album.findByIdAndRemove(albumId, (err, albumRemoved)=>{
        if(err){
            res.status(500).send({
                message: 'Error al borrar el álbum'
            });
        } else {
            if(!albumRemoved){
                res.status(404).send({
                    message: 'No se ha podido borrar el álbum'
                });                
            } else {
                deleteSongsOfAlbum(albumRemoved, res);
            }
        }    
    });
}

function uploadImage(req,res){
    Utils.uploadImage(req, res, Album, 'álbum');
}

function getImageFile(req,res){
    Utils.getImageFile(req,res,'albums');    
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
    
};


