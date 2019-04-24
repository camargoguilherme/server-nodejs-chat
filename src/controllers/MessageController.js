const Chat = require('../models/Chat')
const Message = require('../models/Message');

class MessageController{
  async store(req, res){
    // Criar uma mensagem
    const sent = req.body.message
    
    const chat = await Chat.findById(req.params.id)

    const message = await Message.create(sent.messages)
    const messagePopulated = await Message.findById(message._id).populate('user', { _id: 1, name: 1 })

    chat.messages.push(message)

    await chat.save();
    
    req.io.sockets.emit(`message-${chat._id}-${sent.receiver_id}`, messagePopulated);
    
    return res.json(messagePopulated);
}

  async show(req, res){
    const message = await Message.findById(req.params.idChat).populate({
      
      options: { sort: { createdAt: -1} }
    });
    return res.json(message);
  }

  async findAll(req, res){
    const message = await Message.findById(req.params.idChat).populate({
      path: 'messages',
      options: { sort: { createdAt: -1} }
    })
    .populate('user', { _id: 1, name: 1 })
    
    return res.json(message);
  }
}

module.exports = new MessageController();