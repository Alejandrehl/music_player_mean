'use strict'

var express = require('express');
var UserController = require('../controllers/userController');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');

//Multiparty permite cargar ficheros
var multipart = require('connect-multiparty');
//Middleware para subir archivos con multiparty
//Se indica el directorio al cual se van a subir los archivos
//Se debe crear la carpeta en el proyecto
var md_upload = multipart({
	uploadDir: './uploads/users'
});

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);

module.exports = api;