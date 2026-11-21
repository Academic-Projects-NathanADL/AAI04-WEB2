const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Treino = sequelize.define('Treino', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  codigo: { type: DataTypes.STRING(40), allowNull: false, unique: true, validate: { notEmpty: true, len: [1, 40] } },
  jogadorId: { type: DataTypes.INTEGER, allowNull: false },
  dataTreino: { type: DataTypes.DATEONLY, allowNull: false, validate: { isDate: true } },
  tipo: { type: DataTypes.ENUM('F', 'T', 'E'), allowNull: false, validate: { isIn: [['F', 'T', 'E']] } },
  duracaoMin: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: true, min: 1 } },
  intensidade: { type: DataTypes.INTEGER, allowNull: false, validate: { isInt: true, min: 1, max: 10 } },
  carga: {
    type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 },
    get() { const valor = this.getDataValue('carga'); return valor === null ? null : Number(valor); }
  }
}, { tableName: 'treinos' });

module.exports = Treino;
