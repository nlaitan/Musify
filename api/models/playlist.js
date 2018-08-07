'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaylistSchema = Schema({
	title: String,
	description: String,
	image: String,
	user: { type: Schema.ObjectId, ref: 'User'},
	songs: [ { type: Schema.ObjectId, ref: 'Song'} ]
});

module.exports = mongoose.model('Playlist', PlaylistSchema);