const Pessoa = require('../models/pessoa');
const Usuario = require('../models/usuario');

function cadastrarView(req, res){
    res.render("cadastro.html", {});
}

function cadastrarPessoa_usuario(req, res){

    
    let pessoa = {
        nome: req.body.nome,
        cpf: req.body.cpf,
        data_nascimento: req.body.date,
        telefone: req.body.telefone,
        endereco: req.body.end_completo,
        cep: req.body.cep
    }
    
    if (pessoa.nome == null ||
    pessoa.cpf == null ||
    pessoa.data_nascimento == null ||
    pessoa.telefone == null ||
    pessoa.endereco == null ||
    pessoa.cep == null) {
        return res.render('cadastro.html', { erro: "Preencha todos os campos" });
    }
    Pessoa.create(pessoa).then((result)=>{
        req.session.pessoa = result
        let usuario = {
            email: req.body.email,
            password: req.body.password,
            pessoaId: result.id
        }
        Usuario.create(usuario).then((user) => {
            req.session.autorizado = true
            req.session.usuario = user;
            res.render('cliente/cadastrando_corrente.html', { pessoa });
        }).catch((err) => {
            console.log(err);
            if (err.name === 'SequelizeUniqueConstraintError') {
                let erro = "Email ja cadastrado. Escolha outro email.";
                return res.render('cadastro.html', { erro });
              } else {
                let erro = err;
                return res.render('cadastro.html', { erro });
            }
        });
    }).catch((err) => {
        console.log(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            let erro = "Cpf ja cadastrado";
            return res.render('cadastro.html', { erro });
          } else {
            let erro = err;
            return res.render('cadastro.html', { erro });
        }
    });
    
}

function listarView(req, res){

    let sucesso_excluir = req.query.sucesso_excluir
    let erro_excluir = req.query.erro_excluir
    

    Pessoa.findAll().then((pessoas)=>{
        res.render("pessoa/listar.html", {pessoas, sucesso_excluir, erro_excluir});
    }).catch((err) => {
        console.log(err)
        let erro = err
        res.render("pessoa/listar.html", {erro});
    })
}

function editarView(req, res){
    let id = req.params.id
    let pessoa;
    Pessoa.findByPk(id).then(function(pessoa){
        res.render("pessoa/editar.html", {pessoa});
    })
}

function editarPessoa(req, res) {
    let pessoa = {
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        cpf: req.body.cpf,
        email: req.body.email,
        telefone: req.body.telefone,
        altura: req.body.altura,
        peso: req.body.peso
    }
    Pessoa.update(
      pessoa,
      {
        where: {
          id: req.body.id,
        },
      }
    ).then(function (sucesso) {
        res.render("pessoa/editar.html", {pessoa, sucesso});
    })
    .catch(function (erro) {
        res.render("pessoa/editar.html", {pessoa, erro})
    });

}

function excluirPessoa(req, res) {
   
    Pessoa.destroy(
      {
        where: {
          id: req.body.id,
        },
      }
    ).then(function (sucesso) {
        res.redirect("/pessoa/listar?sucesso_excluir=1");
    })
    .catch(function (erro) {
        res.redirect("/pessoa/listar?erro_excluir=1")
    });

}

module.exports =  {
    cadastrarView,
    cadastrarPessoa_usuario,
    listarView,
    editarView,
    editarPessoa,
    excluirPessoa,
};