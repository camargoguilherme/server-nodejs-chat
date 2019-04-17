const Message = require('../models/Message');

class MessageController{
  async store(req, res){
    const message = await Message.create(req.body);
    return res.json(message);
  }

  async show(req, res){
    const message = await Message.findById(req.params.id).populate({
      
      options: { sort: { createdAt: -1} }
    });
    return res.json(message);
  }
}

module.exports = new MessageController();