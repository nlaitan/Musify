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
    Utils.getEntities(req,res,Album,'álbums','title');
    
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums
    
    
};


