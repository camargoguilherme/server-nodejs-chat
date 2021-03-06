const mongoose = require('mongoose');

const Message = new mongoose.Schema({
  text:{
    type: String,
    require: true
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  chat:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  status:{
    type: Boolean,
    default: false
  }
},{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

module.exports = mongoose.model('Message', Message);