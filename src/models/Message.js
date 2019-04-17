const mongoose = require('mongoose');

const Message = new mongoose.Schema({

},{
  timestamps: true
});

  module.exports = mongoose.model('Message', Message);