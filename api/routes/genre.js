'use strict'

var express = require('express');
var GenreController = require('../controllers/genre');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.get('/genre/:id', md_auth.ensureAuth, GenreController.getGenre);
api.get('/genres/:supergenre?', md_auth.ensureAuth, GenreController.getGenres);
api.post('/genre', md_auth.ensureAuth, GenreController.saveGenre);
api.put('/genre/:id', md_auth.ensureAuth, GenreController.updateGenre);
api.delete('/genre/:id', md_auth.ensureAuth, GenreController.deleteGenre);


module.exports = api;