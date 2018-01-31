'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema({
	name: String,
	description: String,
	image: String
});

module.exports = mongoose.model('Artist', ArtistSchema);