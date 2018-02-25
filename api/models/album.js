'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: { type: Schema.ObjectId, ref: 'Artist' }
	//Guarda un ID de otro objeto que tengamos en la base de datos
});

module.exports = mongoose.model('Album', AlbumSchema);