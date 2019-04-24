const Chat = require('../models/Chat');

class ChatController {
  async store(req, res) {
    const chat = await Chat.create(req.body);
    return res.json(chat);
  }

  async show(req, res) {
    const chat = await Chat.findOne({title: req.params.title}).populate({
      path: 'messages',
      options: {
        sort: {
          createdAt: -1
        }
      }
    });
    return res.json(chat);
  }

  async findOne(req, res) {
    const { title1, title2 } = req.headers

    let chat = await Chat.findOne(
      {
        title: title1
      }
    )
    .populate({
      path: 'messages',
      populate: { path: 'user', select: '_id' },
      options: {
        sort: {
          createdAt: -1
        }
      }
    })
    .populate('users', {_id: 1, name: 1})

    if(chat == null){
      chat = await Chat.findOne(
        {
          title: title2
        }
      )
      .populate({
        path: 'messages',
        populate: { path: 'user', select: '_id' },
        options: {
          sort: {
            createdAt: -1
          }
        }
      })
      .populate('users', {_id: 1, name: 1})
    }
    
    return res.json(chat)
  }
}

module.exports = new ChatController();