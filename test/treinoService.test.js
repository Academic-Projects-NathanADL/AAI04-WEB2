const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularCarga } = require('../src/services/calculoCarga');
const { inicioDaSemana, validarData } = require('../src/utils/semana');

test('calcula treino físico usando o multiplicador 1,5', () => {
  assert.equal(calcularCarga({ duracaoMin: 60, intensidade: 8, tipo: 'F' }), 72);
});

test('calcula cargas dos tipos técnico e estratégico', () => {
  assert.equal(calcularCarga({ duracaoMin: 50, intensidade: 6, tipo: 'T' }), 36);
  assert.equal(calcularCarga({ duracaoMin: 50, intensidade: 6, tipo: 'E' }), 30);
});

test('rejeita intensidade, duração e tipo inválidos com HTTP 400', () => {
  for (const input of [
    { duracaoMin: 60, intensidade: 0, tipo: 'F' },
    { duracaoMin: 60, intensidade: 11, tipo: 'F' },
    { duracaoMin: 0, intensidade: 5, tipo: 'F' },
    { duracaoMin: 10, intensidade: 5, tipo: 'X' }
  ]) assert.throws(() => calcularCarga(input), error => error.status === 400);
});

test('normaliza datas de referência para segunda-feira a domingo', () => {
  assert.deepEqual(inicioDaSemana('2026-10-07'), { inicio: '2026-10-05', fim: '2026-10-11' });
  assert.deepEqual(inicioDaSemana('2026-10-11'), { inicio: '2026-10-05', fim: '2026-10-11' });
});

test('valida datas no formato ISO e rejeita datas impossíveis', () => {
  assert.equal(validarData('2026-10-05'), true);
  assert.equal(validarData('2026-02-30'), false);
  assert.equal(validarData('05/10/2026'), false);
});

test('arredonda médias decimais corretamente', () => {
  const { arredondarDuasCasas } = require('../src/utils/arredondamento');
  assert.equal(arredondarDuasCasas(33.525), 33.53);
  assert.equal(arredondarDuasCasas(58.875), 58.88);
});
