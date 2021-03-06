'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
	var albumId = req.params.id;
	//Buscar album y conseguir todos los datos del artista que ha creado un album	
	Album.findById(albumId).populate({
		path: 'artist'
	}).exec((err, album) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!album){
				res.status(404).send({
					message: 'El album no existe'
				});
			}else{
				res.status(200).send({
					album
				});
			}
		}
	});
}

function getAlbums(req, res){
	var artistId = req.params.artist;

	if(!artistId){
		//Sacar todos los albums de la base de datos
		//Ordenar por titulo
		var find = Album.find({}).sort('title');
	}else{
		//Sacar los albums de un artista en concreto de la base de datos
		//Ordenar por año
		var find = Album.find({
			artist: artistId
		}).sort('year');
	}

	find.populate({
		path: 'artist'
	}).exec((err, albums) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!albums){
				res.status(404).send({
					message: 'No hay albums'
				});				
			}else{
				res.status(200).send({
					albums
				});
			}
		}
	});
}

function saveAlbum(req, res){
	var album = new Album();
	var params = req.body;

	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if(err){
			res.status(500).send({
				message: 'Error en el servidor'
			});
		}else{
			if(!albumStored){
				res.status(404).send({
					message: 'No se ha guardado el album'
				});
			}else{
				res.status(200).send({
					album: albumStored
				});
			}
		}
	});
}

function updateAlbum(req, res){
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if(err){
			res.status(500).send({
				message: 'No se ha actualizado el album'
			});
		}else{
			res.status(200).send({
				album: albumUpdated
			});
		}
	});
}

function deleteAlbum(req, res){
	var albumId = req.params.id;

	Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
		if(err){
			res.status(500).send({
				message: 'Error al eliminar el album'
			});
		}else{
			if(!albumRemoved){
				res.status(404).send({
					message: 'El album no ha sido eliminado'
				});
			}else{
				Song.find({
					album: albumRemoved._id
				}).remove((err, songRemoved) => {
					if(err){
						res.status(500).send({
							message: 'Error al eliminar la canción'
						});
					}else{
						if(!songRemoved){
							res.status(404).send({
								message: 'La canción no ha sido eliminada'
							});
						}else{
							res.status(200).send({
								album: albumRemoved
							});
						}
					}
				});
			}
		}
	});
}

//Subir imagen
function uploadImage(req, res){
	var albumId = req.params.id;
	var file_name = 'No subido...';

	//Con el connect-multiparty (declarada en albumRoutes)
	//Podemos utilizar las variables globales como files
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		//Sacar extensión de imagen
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

			Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
				if(!albumUpdated){
					res.status(400).send({
						message: 'Extensión del archivo no valida'
					});
				}else{
					res.status(200).send({
						user: albumUpdated
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
			message: 'No has subido ninguna imagen ...'
		});		
	}
}

//Obtener imagen de album
function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/albums/'+imageFile;

	fs.exists(path_file, function(exists){
		if(exists){
			res.status(200).sendFile(path.resolve(path_file));	
		}else{
			res.status(200).send({
				message: 'No existe la imagen ...'
			});	
		}
	});
}

module.exports = {
	getAlbum, 
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}