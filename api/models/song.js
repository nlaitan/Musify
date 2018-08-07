'use strict'

var mongoose = require('mongoose'),
 	PlaylistSchema = require('./playlist.js'),
	Schema = mongoose.Schema;

var SongSchema = Schema({
	number: String,
    name: String,
	duration: String,
	file: String,
    album: { type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Song', SongSchema);