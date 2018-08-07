'use strict'

var express = require('express');
var PlaylistController = require('../controllers/playlist');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/playlists' });


api.post('/playlist', md_auth.ensureAuth, PlaylistController.savePlaylist);
api.get('/playlist/:id', md_auth.ensureAuth, PlaylistController.getPlaylist);
api.get('/playlists/:user?', md_auth.ensureAuth, PlaylistController.getPlaylists);
api.put('/playlist/:id', md_auth.ensureAuth, PlaylistController.updatePlaylist);
api.put('/add-song-playlist/:id', md_auth.ensureAuth, PlaylistController.addSong);
api.delete('/playlist/:id', md_auth.ensureAuth, PlaylistController.deletePlaylist);
api.post('/upload-image-playlist/:id', [md_auth.ensureAuth, md_upload], PlaylistController.uploadImage);
api.get('/get-image-playlist/:imageFile', PlaylistController.getImageFile);

/*
api.get('/all-albums/:page?', md_auth.ensureAuth, AlbumController.getAllAlbums);
*/


module.exports = api;