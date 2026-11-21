const service = require('../services/configuracaoService');

function dataIsoValida(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

async function consultarConfiguracao(req, res, next) {
  try {
    const configuracao = await service.obterConfiguracao();
    if (!configuracao) return res.status(404).json({ erro: 'Nenhuma configuração cadastrada.' });
    return res.json(configuracao);
  } catch (error) { return next(error); }
}
async function atualizarConfiguracao(req, res, next) {
  try {
    const { cargaMaximaSemanal, dataVigencia } = req.body;
    if (cargaMaximaSemanal === undefined || !Number.isFinite(Number(cargaMaximaSemanal)) || Number(cargaMaximaSemanal) < 0) return res.status(400).json({ erro: 'cargaMaximaSemanal deve ser um número maior ou igual a zero.' });
    if (dataVigencia && !dataIsoValida(dataVigencia)) return res.status(400).json({ erro: 'dataVigencia deve ser uma data válida no formato YYYY-MM-DD.' });
    const configuracao = await service.atualizarConfiguracao({ cargaMaximaSemanal, dataVigencia });
    return res.status(201).json(configuracao);
  } catch (error) { return next(error); }
}

module.exports = { consultarConfiguracao, atualizarConfiguracao };
