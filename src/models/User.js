var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    //required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    //required: true,
    trim: true
  },
  logged: {
    type: Boolean,
    default: false
  },
  token: {
    type: String
  }
});

User.methods = {
  _hashPassword(password) {
    return bcrypt.hashSync(password);
  },
  authenticateUser(password) {
    return bcrypt.compareSync(password, this.password);
  },
  createToken() {
    // create a token
    var token = jwt.sign({
      id: this._id
    }, process.env.JWT_WORD || config.secret, {
      //expiresIn: 86400 // expires in 24 hours
    });
    return token
  },
  toJson() {
    return {
      auth: true,
      _id: this._id,
      username: this.username,
      email: this.email,
      name: this.name,
      token: this.createToken()
    }
  },
};

User.pre('save', function (next) {
  console.log('pre save password: ' + this.password);
  //if (this.isModified('password')) // If the pw has been modified, then encrypt it again
  this.password = bcrypt.hashSync(this.password);
  next();
});

module.exports = mongoose.model('User', User);