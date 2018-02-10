'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({
	number: String,
	name: String,
	duration: String,
	file: String,
	album: { type: Schema.ObjectId, ref: 'Album' }
	//Guarda un ID de otro objeto que tengamos en la base de datos
});

module.exports = mongoose.model('Song', SongSchema);