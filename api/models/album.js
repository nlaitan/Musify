'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: { type: Schema.ObjectId, ref: 'Artist'},
	first_genre: { type: Schema.ObjectId, ref: 'Genre'},
	second_genre: { type: Schema.ObjectId, ref: 'Genre'}
});

module.exports = mongoose.model('Album', AlbumSchema);