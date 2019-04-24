const mongoose = require('mongoose');

const Chat = new mongoose.Schema({
  title:{
    type: String,
    require: true
  },
  users:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }]
},{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

module.exports = mongoose.model('Chat', Chat);