'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');
var playlist_routes = require('./routes/playlist');
var genre_routes = require('./routes/genre');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// cabeceras http
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    
    next();
});

// rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);
app.use('/api', playlist_routes);
app.use('/api', genre_routes);


module.exports = app;

