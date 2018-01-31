'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

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

module.exports =  {
	pruebas,
	saveUser,
	loginUser
};