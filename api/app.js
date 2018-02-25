'use strict'
//Cargar Librerias
var express = require('express');
var bodyParser = require('body-parser');

//Crear el objeto de express
var app = express();

//Cargar rutas
var user_routes = require('./routes/userRoutes');
var artist_routes = require('./routes/artistRoutes');
var album_routes = require('./routes/albumRoutes');
var song_routes = require('./routes/songRoutes');

//Configurar body parser. Convierten las peticiones que nos llegan por http en objetos JSON.
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

//Configurar cabeceras https
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});

//Cargar rutas base
app.use('/api', user_routes); //incluir middleware /api
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

//Ruta de prueba
app.get('/pruebas', function(req, res) {
	res.status(200).send({ message: 'Bienvenidos!' });
});

//Exportar el modulo
module.exports = app;