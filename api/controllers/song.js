'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Utils = require('../utils/utils');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getSong(req,res){
    
    var songId = req.params.id;
    Song.findById(songId).populate({
        path: 'album', populate: { path: 'artist'}
    }).exec((err,song)=>{
        Utils.checkErrors(err,res,song,'obtener','canción');
    });
    
}

function saveSong(req,res){
    
    var song = new Song();
    var params = req.body;
    
    //song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;
    
    song.save((err, songStored) => {
        Utils.checkErrors(err,res,songStored,'guardar','canción');
    })
    
}


function getSongs(req,res){
    var albumId = req.params.album;
    
    if(!albumId){
        var find = Song.find({}).sort('name');
    } else {
        var find = Song.find({album: albumId}).sort('name');    
    }
    
    find.populate({
        path: 'album',                                  // matcheo albums
        populate: { path: 'artist', model: 'Artist' }   // vuelvo a matchear artistas
    }).exec((err, songs) => {
        Utils.checkErrors(err, res, songs, 'listar', 'canciones')
    });
    
}


function updateSong(req,res){
    var songId = req.params.id;
    var update = req.body;
    
    Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{
        Utils.checkErrors(err,res,songUpdated,'actualizar','canción');        
    });
}

function deleteSong(req,res){
    var songId = req.params.id;
    
    Song.findByIdAndRemove(songId, (err, songRemoved)=>{
        Utils.checkErrors(err,res,songRemoved,'borrar','canción');   
    });
}

function uploadFile(req,res){
    Utils.uploadFile(req, res, Song, 'canción');
}

function getSongFile(req,res){
    Utils.getSongFile(req,res,'songs');    
}

module.exports = {
    getSong,
    getSongs,
    saveSong,
    updateSong,
    deleteSong,
    getSongFile,
    uploadFile
    
};