'use strict'
var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var ArtistController = require('../controllers/artistController');

api.get('/artist', md_auth.ensureAuth, ArtistController.getArtist);

module.exports = api;