const User = require('../models/User');

class UserController{
  async store(req, res){
    // create a user
    const user = await User.create(req.body);
    
    res.json(user.toJson())
  }

  async update(req, res){
    // create a user
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      req.body,
      {new: true});
    res.json(user.toJson());
  }

  async authenticate(req, res){
    const { username } = req.body
    await User.findOne( { username }, function (err, user) {
      console.log(user)
      console.log(req.body)
      if (err) {
        return err
      } else if (!user) {
        return res.json({ auth: false, message: 'Erro ao realizar login, usuário não encontrado'});
      }
      if(!user.authenticateUser(req.body.password)){
        return res.json({ auth: false, message: 'Usuário ou senha inválidos'});
      }
      return res.json(user.toJson());
    });
  }
  
  // verify 
  async isAuthenticate (req, res){
    var token = req.headers['x-access-token'];
    console.log(`isAuthenticate: ${JSON.stringify(user)}`)
    if (!token) 
      return res.json({ auth: false, message: 'Nenhum token fornecido' });
    
    jwt.verify(token, process.env.JWT_WORD || 'JWT_WORD', function(err, decoded) {
      if (err) 
        return res.json({ auth: false, message: 'Falha ao autenticar token' });
      return res.json({ auth: true });
    });
  }
  
}

module.exports = new UserController();