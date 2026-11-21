const sequelize = require('../config/database');
const Jogador = require('./jogador');
const Treino = require('./treino');
const Configuracao = require('./configuracao');

Jogador.hasMany(Treino, {
  as: 'treinos', foreignKey: { name: 'jogadorId', allowNull: false }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
});
Treino.belongsTo(Jogador, { as: 'jogador', foreignKey: 'jogadorId' });

module.exports = { sequelize, Jogador, Treino, Configuracao };
