const { gerarRelatorioSemanal } = require('../services/relatorioService');

async function relatorioSemanal(req, res, next) {
  try {
    const data = req.query.data;
    if (!data) return res.status(400).json({ erro: 'Informe a data de referência pelo parâmetro data (YYYY-MM-DD).' });
    return res.json(await gerarRelatorioSemanal(data));
  } catch (error) { return next(error); }
}

module.exports = { relatorioSemanal };
