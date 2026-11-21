const { Jogador } = require('../models');

async function cadastrarJogador(req, res, next) {
  try { const jogador = await Jogador.create(req.body); return res.status(201).json(jogador); } catch (error) { return next(error); }
}
async function listarJogadores(req, res, next) {
  try { const jogadores = await Jogador.findAll({ order: [['nome', 'ASC']] }); return res.json(jogadores); } catch (error) { return next(error); }
}
async function consultarJogador(req, res, next) {
  try { const jogador = await Jogador.findByPk(req.params.id, { include: [{ association: 'treinos' }] }); if (!jogador) return res.status(404).json({ erro: 'Jogador não encontrado.' }); return res.json(jogador); } catch (error) { return next(error); }
}
async function atualizarJogador(req, res, next) {
  try {
    const jogador = await Jogador.findByPk(req.params.id);
    if (!jogador) return res.status(404).json({ erro: 'Jogador não encontrado.' });
    await jogador.update(req.body);
    return res.json(jogador);
  } catch (error) { return next(error); }
}
async function desativarJogador(req, res, next) {
  try {
    const jogador = await Jogador.findByPk(req.params.id);
    if (!jogador) return res.status(404).json({ erro: 'Jogador não encontrado.' });
    await jogador.update({ ativo: false });
    return res.json({ mensagem: 'Jogador desativado. O histórico de treinos foi preservado.', jogador });
  } catch (error) { return next(error); }
}

module.exports = { cadastrarJogador, listarJogadores, consultarJogador, atualizarJogador, desativarJogador };
