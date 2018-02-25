'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
	var songId = req.params.id;

	Song.findById(songId).populate({
		path: 'album'
	}).exec((err, song) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!song){
				res.status(404).send({
					message: 'La canción no existe!'
				});
			}else{
				res.status(200).send({
					song
				});
			}
		}
	});
}

function saveSong(req, res){
	var song = new Song();
	var params = req.body;

	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err, songStored) => {
		if(err){
			res.status(500).send({
				message: 'Error en el servidor'
			});
		}else{
			if(!songStored){
				res.status(404).send({
					message: 'No se ha guardado la canción'
				});
			}else{
				res.status(200).send({
					song: songStored
				});
			}
		}
	});
}

function getSongs(req, res){
	var albumId = req.params.album;

	if(!albumId){
		var find = Song.find({}).sort('number');
	}else{
		var find = Song.find({album: albumId}).sort('number');
	}

	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	}).exec((err, songs) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!songs){
				res.status(404).send({
					message: 'No hay canciones'
				});
			}else{
				res.status(200).send({
					songs
				});
			}
		}
	});
}

function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if(err){
			res.status(500).send({
				message: 'Error en el servidor'
			});
		}else{
			if(!songUpdated){
				res.status(404).send({
					message: 'No se ha actualizado la canción'
				});
			}else{
				res.status(200).send({
					song: songUpdated
				});
			}
		}
	});
}

function deleteSong(req, res){
	var songId = req.params.id;
	Song.findByIdAndRemove(songId, (err, songRemoved) => {
		if(err){
			res.status(500).send({
				message: 'Error en el servidor'
			});
		}else{
			if(!songRemoved){
				res.status(404).send({
					message: 'No se ha borrado la canción'
				});
			}else{
				res.status(200).send({
					song: songRemoved
				});
			}
		}
	});
}

//Subir canción
function uploadFile(req, res){
	var songId = req.params.id;
	var file_name = 'No subido...';

	//Con el connect-multiparty (declarada en songRoutes)
	//Podemos utilizar las variables globales como files
	if(req.files){
		var file_path = req.files.file.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		//Sacar extensión de imagen
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'mp3' || file_ext == 'ogg'){

			Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
				if(!songUpdated){
					res.status(404).send({
						message: 'No se ha podida actualizar la canción'
					});
				}else{
					res.status(200).send({
						song: songUpdated
					});	
				}
			});

		}else{
			res.status(200).send({
				message: 'Extensión del archivo no valido'
			});
		}

		console.log(file_path);
		console.log(file_split);
		console.log(file_name);
	}else{
		res.status(200).send({
			message: 'No existe el fichero de audio ...'
		});		
	}
}

//Obtener canción
function getSongFile(req, res){
	var songFile = req.params.songFile;
	var path_file = './uploads/songs/'+songFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.status(200).sendFile(path.resolve(path_file));	
		}else{
			res.status(200).send({
				message: 'No existe el fichero de audio ...'
			});	
		}
	});
}

module.exports = {
	getSong,
	saveSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
};