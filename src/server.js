const express = require('express');
const mongoose = require('mongoose'); 
const path = require('path');
const cors = require('cors');
var dotenv;

if(process.env.NODE_ENV === 'DEVELOPMENT' ){
	dotenv = require('dotenv');
	dotenv.config();
}

const app = express();
app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connect', socket =>{
	socket.on('connectRoom', user =>{
		console.log(`${user.username} join`)
		socket.join(user._id)
	})
});

mongoose.connect(process.env.URL_DB, 
	{ 
		useNewUrlParser: true
});

app.use((req, res, next) =>{
	req.io = io;
	return next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require('./routes'));

server.listen(process.env.PORT || 3333);