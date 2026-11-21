const router = require('express').Router();
const controller = require('../controllers/relatorioController');

router.get('/semanal', controller.relatorioSemanal);

module.exports = router;
