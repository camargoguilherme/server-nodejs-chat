const express = require('express'); 
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const MessageController = require('./controllers/MessageController');
const UserController = require('./controllers/UserController');

// Routes para Message

// Routes para User
routes.post('/user', UserController.store)
routes.put('/user/:id', UserController.update)
routes.post('/login', UserController.authenticate)

module.exports  = routes;