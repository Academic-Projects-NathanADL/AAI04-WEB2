const { Op } = require('sequelize');
const { Configuracao } = require('../models');

async function obterConfiguracao(dataReferencia = new Date().toISOString().slice(0, 10)) {
  return Configuracao.findOne({
    where: { [Op.or]: [{ dataVigencia: null }, { dataVigencia: { [Op.lte]: dataReferencia } }] },
    order: [['dataVigencia', 'DESC'], ['id', 'DESC']]
  });
}

async function atualizarConfiguracao({ cargaMaximaSemanal, dataVigencia }) {
  return Configuracao.create({ cargaMaximaSemanal, dataVigencia: dataVigencia || new Date().toISOString().slice(0, 10) });
}

module.exports = { obterConfiguracao, atualizarConfiguracao };
