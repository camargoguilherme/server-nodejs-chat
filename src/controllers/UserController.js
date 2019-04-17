const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController{
  async store(req, res){
    // create a user
    console.log(req.body)

    await User.create(req.body, function(error, user){
      if(error){
        res.json(error);
      }
      userJoin(req, user.toJson());
      res.json(user.toJson())
    });
    
    
  }

  async update(req, res){
    // create a user
    console.log(req.body)

    await User.findOneAndUpdate(
      { email: req.body.email }, 
      req.body,
      {new: true},
      function(error, user){
        if(error){
          res.json(error)
        }
        user.save();
        res.json(user.toJson());
      });
    
  }

  async authenticate(req, res){
    const { username } = req.body

    console.log(req.body)

    await User.findOneAndUpdate( { username }, { logged: true }, function (err, user) {
      
      if (err) {
        return err
      } else if (!user) {
        return res.json({ auth: false, message: 'Erro ao realizar login, usuário não encontrado'});
      }
      if(!user.authenticateUser(req.body.password)){
        return res.json({ auth: false, message: 'Usuário ou senha inválidos'});
      }
      userJoin(req, user.toJson())
      return res.json(user.toJson());
    });
  }
  
  // verify 
  async isAuthenticate (req, res){
    const token = req.headers['x-access-token'];
    const user = await User.findById(req.headers.id);
    console.log(`isAuthenticate: ${JSON.stringify(user)}`)
    if (!token) 
      return res.json({ auth: false, message: 'Nenhum token fornecido' });
    
    jwt.verify(token, process.env.JWT_WORD || 'JWT_WORD', function(err, decoded) {
      if (err) 
        return res.json({ auth: false, message: 'Falha ao autenticar token' });
      
      userJoin(req, user.toJson());
      return res.json({ auth: true });
    });
  }  
}

async function userJoin(req, user) {
  await User.findOneAndUpdate( { id: user._id }, { logged: true, ...user }, {new: true} );

  const users = await User.find({logged: true})
  console.log(`${users.length} users logged`)
  req.io.sockets.emit('join', users);
  
}

module.exports = new UserController();