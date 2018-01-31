'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

//Recoge una request, una response y next para salir del middleware
exports.ensureAuth = function(req, res, next){
	if(!req.headers.authorization){
		return res.status(403).send({
			message: 'La petición no tiene la cabecera de autenticación'
		});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');

	try{
		var payload = jwt.decode(token, secret);
		//Si la fecha de expiración es menor a la fecha actual
		if(payload.ex <= moment().unix()){
			return res.status(401).send({
				message: 'El token ha expirado'
			});
		}
	}catch(ex){
		console.log(ex);
		return res.status(404).send({
			message: 'Token no valido'
		});
	}

	req.user = payload;
	next();
};