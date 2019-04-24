const express = require('express');
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const ChatController = require('./controllers/ChatController')
const MessageController = require('./controllers/MessageController');
const UserController = require('./controllers/UserController');

// Route Home
routes.get('/', (req, res) => {
  res.json({
    name: 'Server Chat',
    status: 'ok'
  })
})

// Routes para Chat
routes.get('/chat', UserController.isAuthenticate, ChatController.findOne)
routes.get('/chat/:title', UserController.isAuthenticate, ChatController.show)
routes.post('/chat', UserController.isAuthenticate, ChatController.store)

// Routes para Message
routes.post('/chat/:id/message', UserController.isAuthenticate, MessageController.store)

// Routes para User
routes.get('/user', UserController.isAuthenticate, UserController.findAll)
routes.post('/user', UserController.store)
routes.post('/user/:email', UserController.reset)
routes.put('/user', UserController.isAuthenticate, UserController.update)

// Route para Login
routes.post('/login', UserController.authenticate)

module.exports = routes;