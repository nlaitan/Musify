'use strict'

var mongoose = require('mongoose'),
 	GenreSchema = require('./genre.js'),
	Schema = mongoose.Schema;

var GenreSchema = Schema({
    name: String,
    supergenre: { type: Schema.ObjectId, ref: 'Genre'}
});

module.exports = mongoose.model('Genre', GenreSchema);