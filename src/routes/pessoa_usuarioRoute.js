const express = require('express');
const router = express.Router();

const pessoa_usuarioController = require('../controllers/pessoa_usuarioController');
// const autenticacaoController = require('../controllers/autenticacaoController');

router.get('/cadastro', pessoa_usuarioController.cadastrarView);
router.post('/cadastro', pessoa_usuarioController.cadastrarPessoa_usuario);

// router.get('/pessoa/listar', pessoa_usuarioController.listarView);

// router.get('/pessoa/editar/:id', autenticacaoController.verificarAutenticacao, pessoa_usuarioController.editarView);
// router.post('/pessoa/editar', autenticacaoController.verificarAutenticacao, pessoa_usuarioController.editarPessoa);

// router.post('/pessoa/excluir', autenticacaoController.verificarAutenticacao, pessoa_usuarioController.excluirPessoa);

module.exports = router;