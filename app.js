'use strict'
//Cargar Librerias
var express = require('express');
var bodyParser = require('body-parser');

//Crear el objeto de express
var app = express();

//Cargar rutas
var user_routes = require('./routes/userRoutes');
var artist_routes = require('./routes/artistRoutes');

//Configurar body parser. Convierten las peticiones que nos llegan por http en objetos JSON.
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

//Configurar cabeceras https

//Cargar rutas base
app.use('/api', user_routes); //incluir middleware /api
app.use('/api', artist_routes);

//Ruta de prueba
app.get('/pruebas', function(req, res) {
	res.status(200).send({ message: 'Bienvenidos!' });
});

//Exportar el modulo
module.exports = app;