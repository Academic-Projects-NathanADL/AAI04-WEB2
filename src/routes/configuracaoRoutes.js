const router = require('express').Router();
const controller = require('../controllers/configuracaoController');

router.get('/', controller.consultarConfiguracao);
router.put('/', controller.atualizarConfiguracao);

module.exports = router;
