const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Configuracao = sequelize.define('Configuracao', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cargaMaximaSemanal: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
  dataVigencia: { type: DataTypes.DATEONLY, allowNull: true, validate: { isDate: true } }
}, { tableName: 'configuracoes' });

module.exports = Configuracao;
