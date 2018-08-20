'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Utils = require('../utils/utils');


var Genre = require('../models/genre');



function getGenre(req,res){
    
    var genreId = req.params.id;
    Genre.findById(genreId).populate({path: 'supergenre'}).exec((err,genre)=>{
        Utils.checkErrors(err,res,genre,'obtener','género');
    });
    
}


function saveGenre(req,res){
    
    var genre = new Genre();
    var params = req.body;
    
    genre.name = params.name;
    genre.supergenre = params.supergenre;
    
    genre.save((err, genreStored) => {
        Utils.checkErrors(err,res,genreStored,'guardar','género');
    })
    
}

function getGenres(req,res){
    var superGenreId = req.params.supergenre;
    var find;

    !superGenreId ? (find = Genre.find({}).sort('name')) :
    (find = Genre.find({supergenre: superGenreId}).sort('name'));
    
    find.populate({path: 'supergenre'}).exec((err, genres) => {
        Utils.checkErrors(err, res, genres, 'listar', 'géneros')
    });
    
}


function updateGenre(req,res){
    var genreId = req.params.id;
    var update = req.body;
    
    Genre.findByIdAndUpdate(genreId, update, (err, genreUpdated)=>{
        Utils.checkErrors(err,res,genreUpdated,'actualizar','género');        
    });
}


function deleteGenre(req,res){
    var genreId = req.params.id;
    
    Genre.findByIdAndRemove(genreId, (err, genreRemoved)=>{
        err ? res.status(500).send({ message: 'Error al borrar el género' }) :
        	!genreRemoved ? res.status(404).send({ message: 'No se ha podido borrar el género' }) :                
            res.status(200).send({ message: 'El género se elimino con éxito' })      
    });
}



module.exports = {
    getGenre,
    saveGenre,
    getGenres,
    updateGenre,
    deleteGenre
};