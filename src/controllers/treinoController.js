const { Treino } = require('../models');
const service = require('../services/treinoService');

function dataIsoValida(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

async function registrarTreino(req, res, next) {
  try { const treino = await service.registrarTreino(req.body); return res.status(201).json(treino); } catch (error) { return next(error); }
}
async function listarTreinos(req, res, next) {
  try {
    const { jogadorId, tipo, de, ate } = req.query;
    if (jogadorId !== undefined && (!/^\d+$/.test(jogadorId) || Number(jogadorId) < 1)) return res.status(400).json({ erro: 'jogadorId deve ser um inteiro positivo.' });
    if (tipo !== undefined && !['F', 'T', 'E'].includes(tipo)) return res.status(400).json({ erro: 'tipo deve ser F, T ou E.' });
    if ((de && !dataIsoValida(de)) || (ate && !dataIsoValida(ate))) return res.status(400).json({ erro: 'As datas de filtro devem ser válidas e usar o formato YYYY-MM-DD.' });
    if (de && ate && de > ate) return res.status(400).json({ erro: 'A data inicial não pode ser posterior à data final.' });
    const treinos = await service.listarTreinos({ jogadorId: jogadorId ? Number(jogadorId) : undefined, tipo, de, ate });
    return res.json(treinos);
  } catch (error) { return next(error); }
}
async function listarTreinosDoJogador(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ erro: 'ID de jogador inválido.' });
    const treinos = await service.listarTreinos({ jogadorId: id });
    return res.json(treinos);
  } catch (error) { return next(error); }
}
async function excluirTreino(req, res, next) {
  try { await service.excluirTreino(req.params.codigo); return res.status(200).json({ mensagem: 'Treino excluído.' }); } catch (error) { return next(error); }
}

module.exports = { registrarTreino, listarTreinos, listarTreinosDoJogador, excluirTreino };
