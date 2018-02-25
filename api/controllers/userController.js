'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

//metodo para probar funcionalidad
//la request es lo que va a recibir en la petición
//la response es lo que va a devolver el metodo
function pruebas(req,res){
	res.status(200).send({
		message: 'Probando una acción del controlador de usuarios del api rest con Node y Mongo'
	});
}

//Metodo de registro de usuarios
function saveUser(req, res){
	//Crear una instancia del objeto
	var user = new User();
	//Guardar en variable params todos los datos que nos llegan por post
	var params = req.body;

	//Console.log para ver que nos llega por la petición
	console.log(params);

	//Asignar a user los valores que nos llegan por post
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password){
		//Encriptar contraseña
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null){
				//Guardar el usuario en la base de datos
				//save -> metodo de mongoose
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({
							message: 'Error al guardar el usuario'
						});
					}else{
						if(!userStored){
							res.status(404).send({
								message: 'No se ha registrado el usuario'
							});
						}else{
							res.status(200).send({
								user: userStored
							});
						}
					}
				}); 
			}else{
				res.status(200).send({
					message: 'Rellenar todos los campos'
				});
			}
		});

	}else{
		res.status(500).send({
			message: 'Introduce la contraseña'
		});
	}
}

//Login - Comprueba que los datos que nos llegan por post
//coincidan con los datos que estan en la BD
function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({ email: email.toLowerCase() }, (err, user) => {
		if(err){
			res.status(500).send({
				message: 'Error en la petición'
			});
		}else{
			if(!user){
				res.status(404).send({
					message: 'El usuario no existe'
				});
			}else{
				//Comprobar contraseña
				bcrypt.compare(password, user.password, function(err, check){
					if(check){
						//Devolver los datos del usuario logeado
						if(params.getHash){
							// Devolver un token de JWT
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({
								user
							});
						}
					}else{
						res.status(404).send({
							message: 'El usuario no ha podido logearse'
						});
					}
				});
			}
		}
	});
}

//Actualizar usuario
function updateUser(req, res){
	//recoger el id del usuario
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			res.status(500).send({
				message: 'Error al actualizar el usuario'
			});
		}else{
			if(!userUpdated){
				res.status(400).send({
					message: 'No se ha podido actualizar el usuario'
				});
			}else{
				res.status(200).send({
					user: userUpdated
				});	
			}
		}
	});
}

//Subir imagen
function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	//Con el connect-multiparty (declarada en userRoutes)
	//Podemos utilizar las variables globales como files
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		//Sacar extensión de imagen
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
				if(!userUpdated){
					res.status(400).send({
						message: 'Extensión del archivo no valida'
					});
				}else{
					res.status(200).send({
						image:file_name,
						user: userUpdated
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

//Obtener imagen de usuario
function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;

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

module.exports =  {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};