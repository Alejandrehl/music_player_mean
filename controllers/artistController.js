'use strict'
var fs = require('fs');
var path = require('path');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
	res.status(200).send({
		message: 'Metodo getArtist del controlador artistController.js'
	});
}

module.exports = {
	getArtist
};