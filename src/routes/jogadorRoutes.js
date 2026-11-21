const router = require('express').Router();
const controller = require('../controllers/jogadorController');

router.post('/', controller.cadastrarJogador);
router.get('/', controller.listarJogadores);
router.get('/:id', controller.consultarJogador);
router.put('/:id', controller.atualizarJogador);
router.patch('/:id/desativar', controller.desativarJogador);

module.exports = router;
