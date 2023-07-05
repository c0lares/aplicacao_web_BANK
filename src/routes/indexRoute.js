const express = require('express');
const router = express.Router();

const autenticacaoController = require('../controllers/indexController');
const loginController = require('../controllers/loginController')

router.get('/', autenticacaoController.loginView);
router.post("/", loginController.realizarLogin);
router.post("/sair", loginController.sair);

module.exports = router;