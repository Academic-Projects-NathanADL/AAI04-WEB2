const { Op } = require('sequelize');
const { Jogador, Treino } = require('../models');
const { calcularCarga, MULTIPLICADORES } = require('./calculoCarga');

async function registrarTreino(dados) {
  const jogador = await Jogador.findByPk(dados.jogadorId);
  if (!jogador) {
    const error = new Error('Jogador não encontrado.'); error.status = 404; throw error;
  }
  if (!jogador.ativo) {
    const error = new Error('Não é possível registrar treino para jogador inativo.'); error.status = 400; throw error;
  }
  const carga = calcularCarga(dados);
  return Treino.create({ ...dados, carga });
}

async function listarTreinos({ jogadorId, tipo, de, ate } = {}) {
  const where = {};
  if (jogadorId) where.jogadorId = jogadorId;
  if (tipo) where.tipo = tipo;
  if (de || ate) {
    where.dataTreino = {};
    if (de) where.dataTreino[Op.gte] = de;
    if (ate) where.dataTreino[Op.lte] = ate;
  }
  return Treino.findAll({ where, include: [{ model: Jogador, as: 'jogador', attributes: ['id', 'nome', 'posicao', 'ativo'] }], order: [['dataTreino', 'ASC'], ['id', 'ASC']] });
}

async function excluirTreino(codigo) {
  const treino = await Treino.findOne({ where: { codigo } });
  if (!treino) { const error = new Error('Treino não encontrado.'); error.status = 404; throw error; }
  await treino.destroy();
}

module.exports = { calcularCarga, registrarTreino, listarTreinos, excluirTreino, MULTIPLICADORES };
