'use strict'
var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var ArtistController = require('../controllers/artistController');

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);

module.exports = api;