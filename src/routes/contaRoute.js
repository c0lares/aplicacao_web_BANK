const express = require('express');
const router = express.Router();

const conta_correnteController = require('../controllers/conta_correnteController');

router.get('/cadastro/corrente', conta_correnteController.cadastrarView);
router.post('/cadastro/corrente', conta_correnteController.cadastrarConta);

router.get("/conta/listar", conta_correnteController.listarView);

router.get("/conta/movimentar/:id", conta_correnteController.editarContaView);

router.get("/conta/transferencia/:id", conta_correnteController.transferenciaView);
router.post(
  "/conta/transferencia",
  conta_correnteController.realizarTransferencia
);

router.get("/conta/deposito/:id", conta_correnteController.depositoView);
router.post("/conta/deposito/", conta_correnteController.realizarDeposito);

router.get("/conta/extrato/:id", conta_correnteController.extratoView);

// router.get('/pessoa/listar', autenticacaoController.verificarAutenticacao, pessoa_usuarioController.listarView);

// router.get('/pessoa/editar/:id', autenticacaoController.verificarAutenticacao, pessoa_usuarioController.editarView);
// router.post('/pessoa/editar', autenticacaoController.verificarAutenticacao, pessoa_usuarioController.editarPessoa);

// router.post('/pessoa/excluir', autenticacaoController.verificarAutenticacao, pessoa_usuarioController.excluirPessoa);

module.exports = router;