const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jogador = sequelize.define('Jogador', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING(120), allowNull: false, validate: { notEmpty: true, len: [2, 120] } },
  posicao: { type: DataTypes.ENUM('G', 'Z', 'M', 'A'), allowNull: false, validate: { isIn: [['G', 'Z', 'M', 'A']] } },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: 'jogadores' });

module.exports = Jogador;
