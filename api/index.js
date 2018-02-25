'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977; //Configurar puerto de servidor, en este caso es 3977


//Conectar BD, El comando NPM start ejecuta este archivo. 
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => {
	if(err){
		throw err;
	}else{
		console.log('La base de datos esta corriendo correctamente');
		app.listen(port, function(){
			console.log('Servidor del API Rest de música escuchando en http://localhost:'+port);
		});
	}
});