const express = require('express'); 
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const MessageController = require('./controllers/MessageController');
const UserController = require('./controllers/UserController');

// Route Home
routes.get('/',(req, res) =>{
  res.json({ name: 'Server Chat', status: 'ok' })
})

// Routes para Message

// Routes para User
routes.post('/user', UserController.store)
routes.put('/user', UserController.update)
routes.post('/login', UserController.authenticate)
routes.post('/auth', UserController.isAuthenticate)

module.exports  = routes;