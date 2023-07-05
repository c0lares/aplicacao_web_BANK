const Usuario = require("../models/usuario");
const database = require("../db");

function realizarLogin(req, res) {
  Usuario.findOne({
    where: { email: req.body.email, password: req.body.senha }
  }).then((usuario) => {
    if (!usuario) {
      return res.render('index.html', {
        erro: "Usuario ou senha invalidos",
      });
    }
    req.session.autorizado = true
    req.session.usuario = usuario
    res.redirect('/conta/listar');
  }).catch((error) => {
    console.log(error);
    return res.render('index.html', {
      erro: "Ocorreu um erro durante o login"
    });
  })
}


function sair(req, res) {
  req.session.destroy(function(err) {
      console.log('Usuário desautorizado')
   })
   res.redirect('/')
}

function verificarAutenticacao(req, res, next) {
  if (req.session.autorizado){
      console.log('Usuário autorizado')
      next()
  }
  else{
      console.log('Usuário NÃO autorizado')
      res.redirect('/')
  }
}

module.exports =  {
  realizarLogin,
  verificarAutenticacao,
  sair
};

