const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error instanceof UniqueConstraintError) return res.status(409).json({ erro: 'Já existe um registro com esse código ou valor único.' });
  if (error instanceof ValidationError) return res.status(400).json({ erro: 'Dados inválidos.', detalhes: error.errors.map(item => item.message) });
  if (error instanceof ForeignKeyConstraintError) return res.status(400).json({ erro: 'Referência inválida: verifique o jogador informado.' });
  const status = Number.isInteger(error.status) ? error.status : 500;
  const mensagem = status < 500 ? error.message : 'Erro interno do servidor.';
  if (status >= 500) console.error(error);
  return res.status(status).json({ erro: mensagem });
}

module.exports = errorHandler;
