const { Op, fn, col } = require('sequelize');
const { Jogador, Treino } = require('../models');
const { obterConfiguracao } = require('./configuracaoService');
const { inicioDaSemana, validarData } = require('../utils/semana');
const { arredondarDuasCasas } = require('../utils/arredondamento');

async function gerarRelatorioSemanal(dataReferencia) {
  if (!validarData(dataReferencia)) {
    const error = new Error('Informe uma data válida no formato YYYY-MM-DD.'); error.status = 400; throw error;
  }
  const semana = inicioDaSemana(dataReferencia);
  const configuracao = await obterConfiguracao(semana.inicio);
  if (!configuracao) {
    const error = new Error('Cadastre a carga máxima semanal antes de gerar o relatório.'); error.status = 409; throw error;
  }

  const treinos = await Treino.findAll({
    where: { dataTreino: { [Op.between]: [semana.inicio, semana.fim] } },
    include: [{ model: Jogador, as: 'jogador', attributes: ['id', 'nome', 'posicao'] }],
    order: [['dataTreino', 'ASC'], ['id', 'ASC']]
  });
  const agregadosPorJogador = await Treino.findAll({
    attributes: [
      [col('jogador.id'), 'jogadorId'],
      [col('jogador.nome'), 'nome'],
      [col('jogador.posicao'), 'posicao'],
      [fn('SUM', col('Treino.carga')), 'cargaSemanal'],
      [fn('COUNT', col('Treino.id')), 'quantidadeTreinos']
    ],
    include: [{ model: Jogador, as: 'jogador', attributes: [] }],
    where: { dataTreino: { [Op.between]: [semana.inicio, semana.fim] } },
    group: [col('jogador.id'), col('jogador.nome'), col('jogador.posicao')],
    raw: true
  });
  const ranking = agregadosPorJogador.map(item => ({
    jogadorId: Number(item.jogadorId), nome: item.nome, posicao: item.posicao,
    cargaSemanal: arredondarDuasCasas(item.cargaSemanal),
    quantidadeTreinos: Number(item.quantidadeTreinos)
  }));
  const maior = ranking.length ? Math.max(...ranking.map(item => item.cargaSemanal)) : null;
  const menor = ranking.length ? Math.min(...ranking.map(item => item.cargaSemanal)) : null;
  const cargaMaxima = Number(configuracao.cargaMaximaSemanal);
  const emRisco = ranking.filter(item => item.cargaSemanal > cargaMaxima);

  const mediasPorTipo = await Treino.findAll({
    attributes: ['tipo', [fn('AVG', col('carga')), 'cargaMedia'], [fn('COUNT', col('Treino.id')), 'quantidadeTreinos']],
    where: { dataTreino: { [Op.between]: [semana.inicio, semana.fim] } },
    group: ['tipo'], raw: true
  });
  const porPosicao = await Treino.findAll({
    attributes: [[col('jogador.posicao'), 'posicao'], [fn('COUNT', col('Treino.id')), 'quantidadeTreinos'], [fn('AVG', col('Treino.carga')), 'cargaMedia']],
    include: [{ model: Jogador, as: 'jogador', attributes: [] }],
    where: { dataTreino: { [Op.between]: [semana.inicio, semana.fim] } },
    group: [col('jogador.posicao')], raw: true
  });

  return {
    semana: { inicio: semana.inicio, fim: semana.fim, dataReferencia },
    criterioRanking: 'Considera somente jogadores com pelo menos um treino na semana; todos os empates são apresentados.',
    cargaMaximaSemanal: cargaMaxima,
    totalTreinos: treinos.length,
    porJogador: ranking,
    maiorCargaSemanal: maior === null ? [] : ranking.filter(item => item.cargaSemanal === maior),
    menorCargaSemanal: menor === null ? [] : ranking.filter(item => item.cargaSemanal === menor),
    jogadoresEmRisco: { quantidade: emRisco.length, jogadores: emRisco.map(item => ({ ...item, indicador: 'RISCO DE SOBRECARGA' })) },
    mediaPorTipo: ['F', 'T', 'E'].map(tipo => {
      const row = mediasPorTipo.find(item => item.tipo === tipo);
      return { tipo, quantidadeTreinos: Number(row?.quantidadeTreinos || 0), cargaMedia: row ? arredondarDuasCasas(row.cargaMedia) : 0 };
    }),
    porPosicao: porPosicao.map(item => ({ posicao: item.posicao, quantidadeTreinos: Number(item.quantidadeTreinos), cargaMedia: arredondarDuasCasas(item.cargaMedia) })),
    semanaSemTreinos: treinos.length === 0
  };
}

module.exports = { gerarRelatorioSemanal, inicioDaSemana, validarData };
