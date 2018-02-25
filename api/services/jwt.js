'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

//El objeto de usuario que le pasemos a la funcion lo va a codificar
// y lo va a guardar dentro de un token
exports.createToken = function(user){
	//Datos que se van a codificar
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix()
	};

	return jwt.encode(payload, secret);
};