'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Utils = require('../utils/utils');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');



function getArtist(req,res){
    
    var artistId = req.params.id;
    Artist.findById(artistId, (err, artist) => {
        Utils.checkErrors(err,res,artist,'obtener','artista');
    });
    
}

function saveArtist(req,res){
    
    var artist = new Artist();
    var params = req.body;
    
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';
    
    artist.save((err, artistStored) => {
        Utils.checkErrors(err,res,artistStored,'guardar','artista');
    })
    
}

function getArtists(req, res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerPage = 12;
    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
        if(err){
            res.status(500).send({message: 'Error en la petición.'});
        }else{
            if(!artists){
                res.status(404).send({message: 'No hay artistas!'});
            }else{
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    });
}

function updateArtist(req,res){
    var artistId = req.params.id;
    var update = req.body;
    
    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated)=>{
        Utils.checkErrors(err,res,artistUpdated,'actualizar','artista');        
    });
}

function deleteSongsOfAlbum(albumRemoved, artistRemoved, res){
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
                res.status(200).send({ artist: artistRemoved });    
            }
        }                    
    });
}

function deleteAlbumsOfArtist(artistRemoved, res){
    Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved)=>{
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
                deleteSongsOfAlbum(albumRemoved, artistRemoved, res);
            }
        }                    
    });
}

function deleteArtist(req,res){
    var artistId = req.params.id;
    
    Artist.findByIdAndRemove(artistId, (err, artistRemoved)=>{
        if(err){
            res.status(500).send({
                message: 'Error al borrar el artista'
            });
        } else {
            if(!artistRemoved){
                res.status(404).send({
                    message: 'No se ha podido borrar el artista'
                });                
            } else {
                deleteAlbumsOfArtist(artistRemoved, res);
            }
        }    
    });
}

function uploadImage(req,res){
    Utils.uploadImage(req, res, Artist, 'artista');
}

function getImageFile(req,res){
    Utils.getImageFile(req,res,'artists');    
}

module.exports = {
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};


