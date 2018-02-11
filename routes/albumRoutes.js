'use strict'
var express = require('express');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var AlbumController = require('../controllers/albumController');
var multipart = require('connect-multiparty');
var md_upload = multipart({
	uploadDir: './uploads/albums'
});

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);

module.exports = api;