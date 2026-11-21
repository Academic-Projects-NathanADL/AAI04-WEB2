const router = require('express').Router();
const controller = require('../controllers/treinoController');

router.post('/', controller.registrarTreino);
router.get('/', controller.listarTreinos);
router.get('/jogador/:id', controller.listarTreinosDoJogador);
router.delete('/:codigo', controller.excluirTreino);

module.exports = router;
