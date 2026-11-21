const MULTIPLICADORES = Object.freeze({ F: 1.5, T: 1.2, E: 1.0 });

function calcularCarga({ duracaoMin, intensidade, tipo }) {
  if (!Number.isInteger(Number(duracaoMin)) || Number(duracaoMin) <= 0) {
    const error = new Error('A duração deve ser um número inteiro positivo.');
    error.status = 400;
    throw error;
  }
  if (!Number.isInteger(Number(intensidade)) || Number(intensidade) < 1 || Number(intensidade) > 10) {
    const error = new Error('A intensidade deve ser um número inteiro entre 1 e 10.');
    error.status = 400;
    throw error;
  }
  if (!Object.hasOwn(MULTIPLICADORES, tipo)) {
    const error = new Error('O tipo deve ser F (físico), T (técnico) ou E (estratégico).');
    error.status = 400;
    throw error;
  }
  return Number(((Number(duracaoMin) / 10) * Number(intensidade) * MULTIPLICADORES[tipo]).toFixed(2));
}

module.exports = { calcularCarga, MULTIPLICADORES };
