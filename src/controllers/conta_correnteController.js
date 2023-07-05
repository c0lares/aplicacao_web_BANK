const { Op } = require("sequelize");
const Conta_corrente = require('../models/conta_corrente');
const Pessoa = require("../models/pessoa");
const Usuario = require("../models/usuario");
const Movimento = require("../models/movimento");

function cadastrarView(req, res){
  res.render("cliente/cadastrando_corrente.html", { req });
}


function cadastrarConta(req, res){

    let numeroConta = gerarNumeroConta_corrente();
    let dataAtual = new Date();
    let dataFormatada = dataAtual.toISOString().split('T')[0];
    console.log(req.session.usuario)
    console.log(req.session.pessoa)
    let conta_corrente = {
        numero: numeroConta,
        nome: req.body.nome_corrente,
        data_abertura: dataFormatada,
        usuarioId: req.session.usuario.id
    }
    
    Conta_corrente.create(conta_corrente).then((result)=>{
        // req.session.usuario = Usuario.findByPk(req.session.usuarioId)
        res.redirect('/conta/listar');
    }).catch((err) => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        let erro = "Numero aleatorio da conta ja cadastrado, favor digitar o nome da conta novamente";
        return res.render("cliente/cadastrando_corrente.html", { erro });
      } else {
        console.log(err)
        let erro = err
        res.render("cliente/cadastrando_corrente.html", { erro });
      }
    })
}

function gerarNumeroConta_corrente() {
    var numeroConta = '';
    var digitos = 10; // Número de dígitos na conta corrente
    for (var i = 0; i < digitos; i++) {
      var digito = Math.floor(Math.random() * 10); // Gera um dígito aleatório de 0 a 9
      numeroConta += digito.toString(); // Concatena o dígito à string do número da conta
    }
  
    return numeroConta;
  }

function listarView(req, res){

    // let sucesso_excluir = req.query.sucesso_excluir
    // let erro_excluir = req.query.erro_excluir
    // console.log(req)
    // Conta_corrente.findByPk(req.session.usuario.id).then((contas)=>{
    //     res.render("cliente/contas.html", {contas});
    // }).catch((err) => {
    //     console.log(err)
    //     let erro = err
    //     res.render("cliente/contas.html", {erro});
    // })
    Conta_corrente.findAll({
        include: [
          {
            model: Usuario,
            include: [Pessoa],
          },
        ], where:{
          usuarioId: req.session.usuario.id
        }
      })
        .then((contas) => {
          const contasFormatadas = contas.map((conta) => {
            const dataFormatada = new Date(conta.data_abertura).toLocaleDateString(
              "pt-BR"
            );
    
            return {
              id: conta.id,
              nome: conta.nome,
              numero: conta.numero,
              saldo: conta.saldo,
              data_abertura: dataFormatada,
              responsavel: conta.usuario.pessoa.nome,
            };
          });
          res.render("cliente/contas.html", { contas: contasFormatadas });
        })
        .catch((err) => {
          let erro = err;
          res.render("cliente/contas.html", { erro });
        });
}


async function editarContaView(req, res) {
    req.session.id_conta = req.params.id;
  
    Conta_corrente.findByPk(req.session.id_conta, {
      include: [
        {
          model: Usuario,
          include: [Pessoa],
        },
      ],
    }).then(function (conta) {
      const dataFormatada = new Date(conta.data_abertura).toLocaleDateString(
        "pt-BR"
      );
      const partesData = dataFormatada.split("/");
  
      res.render("cliente/pagina_inicial.html", {
        conta: {
          id: conta.id,
          nome: conta.nome,
          numero: conta.numero,
          saldo: conta.saldo,
          data_abertura: `${partesData[2]}-${partesData[1]}-${partesData[0]}`,
          cpf: conta.usuario.pessoa.cpf,
          responsavel: conta.usuario.pessoa.nome
        },
      });
    });
}

function depositoView(req, res) {
  req.session.id_conta = req.params.id;
  Conta_corrente.findByPk(req.session.id_conta).then(function (conta) {
    res.render("cliente/transacoes/depositar.html", { conta });
  });
}

async function realizarDeposito(req, res) {
  
  const conta = await Conta_corrente.findByPk(req.session.id_conta);
  
  if (!conta) {
    return res.render("cliente/transacoes/depositar.html", {
      erro: "Nao foi possivel encontrar a conta",
    });
  }
  
  if (req.body.input_valor <= 0) {
    return res.render("cliente/transacoes/depositar.html", {
      erro: "O valor deve ser maior que zero", conta: conta
    });
  }
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  conta
    .update({ saldo: Number(conta.saldo) + Number(req.body.input_valor) })
    .then(function (conta) {
      let movimentoCredito = {
        tipo: "C",
        data_movimento: `${year}-${month}-${day}`,
        valor: req.body.input_valor,
        conta_corrente_origem: null,
        conta_corrente_destino: null,
        contaCorrenteId: req.session.id_conta,
        observacao: "DEPOSITO",
      };
      console.log(movimentoCredito);
      Movimento.create(movimentoCredito).then(function () {
        const redirectURL = '/conta/movimentar/' + req.session.id_conta;
        res.redirect(redirectURL)
      });
    })
    .catch(function (erro) {
      console.log(erro);
      return res.render("cliente/transacoes/depositar.html", { erro });
    });
}

function transferenciaView(req, res) {
  req.session.id_conta = req.params.id;
  Conta_corrente.findByPk(req.session.id_conta).then(function (conta) {
    res.render("cliente/transacoes/transferir.html", { conta });
  });
}

async function realizarTransferencia(req, res) {

  const conta = await Conta_corrente.findByPk(req.session.id_conta);

  if (!conta) {
    return res.render("cliente/transacoes/transferir.html", {
      erro: "Nao foi possivel encontrar a conta origem", conta
    });
  }
  if (
    req.body.input_conta == null ||
    req.body.valor == null
  ) {
    return res.render("cliente/transacoes/transferir.html", {
      erro: "Preencha todos os campos para realizar a transferÃªncia", conta
    });
  }

  const destino = await Conta_corrente.findOne({
    where: { numero: req.body.input_conta},
  });

  if (!destino) {
    return res.render("cliente/transacoes/transferir.html", {
      erro: "Nao foi possivel encontrar a conta destino", conta
    });
  }


  if (conta.saldo < req.body.valor) {
    return res.render("cliente/transacoes/transferir.html", {
      erro: "Saldo insuficiente", conta
    });
  }

  if(req.body.valor < 0){
    return res.render("cliente/transacoes/transferir.html", {
      erro: "O valor nÃ£o pode ser negativo!", conta
    });
  }
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let informacoesSaldoconta = {
    saldo: conta.saldo - req.body.valor,
  };
  Conta_corrente.update(informacoesSaldoconta, {
    where: { id: conta.id },
  })
    .then(function () {
      let movimentoDebito = {
        tipo: "D",
        data_movimento: `${year}-${month}-${day}`,
        valor: req.body.valor,
        conta_corrente_origem: conta.numero,
        conta_corrente_destino: destino.numero,
        contaCorrenteId: conta.id,
      };

      Movimento.create(movimentoDebito).then(function () {
        let informacoesSaldoDestino = {
          saldo: Number(destino.saldo) + Number(req.body.valor),
        };
        Conta_corrente.update(informacoesSaldoDestino, {
          where: { id: destino.id },
        }).then(function () {
          let movimentoCredito = {
            tipo: "C",
            data_movimento: `${year}-${month}-${day}`,
            valor: req.body.valor,
            conta_corrente_origem: conta.numero,
            conta_corrente_destino: destino.numero,
            contaCorrenteId: destino.id,
          };
          Movimento.create(movimentoCredito).then(function () {
            const redirectURL = '/conta/movimentar/' + req.session.id_conta;
            res.redirect(redirectURL)
          });
        });
      });
    })
    .catch(function (erro) {
      return res.render("cliente/transacoes/transferir.html", {
        erro, conta
      });
    });
}


function extratoView(req, res) {
  req.session.id_conta = req.params.id;
  Movimento.findAll({ where: { contaCorrenteId: req.session.id_conta } })
    .then(function (movimentos) {
      const movimentacoesFormatadas = movimentos.map((movimento) => {
        const dataFormatada = new Date(
          movimento.data_movimento
        ).toLocaleDateString("pt-BR");

        return {
          id: movimento.id,
          tipo: movimento.tipo == "D" ? "DÉBITO" : "CRÉDITO",
          data_movimento: dataFormatada,
          valor: movimento.valor,
          conta_corrente_origem: movimento.conta_corrente_origem,
          conta_corrente_destino: movimento.conta_corrente_destino,
          observacao: movimento.observacao,
        };
      });
      console.log(movimentos);
      res.render("cliente/transacoes/mostrar_movimentacoes.html", {
        movimentacoes: movimentacoesFormatadas,
      });
    })
    .catch(function (erro) {
      console.log(erro);
      return res.render("cliente/transacoes/mostrar_movimentacoes.html", { erro });
    });
}

module.exports =  {
    cadastrarView,
    cadastrarConta,
    listarView,
    editarContaView,
    depositoView,
    realizarDeposito,
    transferenciaView,
    realizarTransferencia,
    extratoView
};