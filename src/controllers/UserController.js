const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
  async store(req, res) {
    // create a user
    console.log(req.body)

    await User.create(req.body, function (error, user) {
      if (error) {
        res.json(error);
      }
      user.token = user.toJson().token
      //user.save()
      userJoin(req, user.toJson())
      res.json(user.toJson())
    });
  }

  async update(req, res) {
    const token = req.headers['x-access-token'];
    let idUser;
    if (!token)
      return res.json({
        auth: false,
        message: 'Nenhum token fornecido'
      });

    jwt.verify(token, process.env.JWT_WORD || 'JWT_WORD', async function (err, decoded) {
      if (err)
        return res.json({
          auth: false,
          message: 'Falha ao autenticar token'
        });

      await User.findOneAndUpdate({
        _id: decoded.id
      },
      req.body, {
        new: true
      },
      function (error, user) {
        if (error) {
          res.json(error)
        }
        user.save();
        res.json(user.toJson());
      });
    });
  }

  async reset(req, res) {
    // create a user
    console.log(req.body)

    await User.findOneAndUpdate({
        email: req.params.email
      },
      req.body, {
        new: true
      },
      function (error, user) {
        if (error) {
          return res.json(error)
        }
        if(!user){
          return res.json({auth: false, message:'E-mail nao está vinculado a nenum usuário'})
        }
        user.save();
        return res.json(user.toJson());
      });

  }

  async authenticate(req, res) {
    const {
      username
    } = req.body

    console.log(req.body)

    await User.findOneAndUpdate({
      username
    }, {
      logged: true
    }, function (err, user) {

      if (err) {
        return err
      } else if (!user) {
        return res.json({
          auth: false,
          message: 'Erro ao realizar login, usuário não encontrado'
        });
      }
      if (!user.authenticateUser(req.body.password)) {
        return res.json({
          auth: false,
          message: 'Usuário ou senha inválidos'
        });
      }
      userJoin(req, user.toJson())
      return res.json(user.toJson());
    });
  }

  // verify 
  async isAuthenticate(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token)
      return res.json({
        auth: false,
        message: 'Nenhum token fornecido'
      });

    jwt.verify(token, process.env.JWT_WORD || 'JWT_WORD', function (err, decoded) {
      if (err)
        return res.json({
          auth: false,
          message: 'Falha ao autenticar token'
        });

      return next();
    });
  }

  auth(req, res){
    res.json({auth: true, message: 'Usuario autenticado com sucesso'})
  }

  async findAll(req, res) {
    const users = await User.find({
      logged: true
    },{
      _id: 1,
      username: 1,
      name: 1,
      email: 1,
      token: 1
    })
    
    //console.log(users)

    return res.json(users)
  }
}

async function userJoin(req, user) {
  await User.findOneAndUpdate({
    id: user._id
  }, {
    logged: true,
    ...user
  }, {
    new: true
  });

  const users = await User.find({
    logged: true
  })
  console.log(`${users.length} users logged`)
  req.io.sockets.emit('join', users);

}

module.exports = new UserController();