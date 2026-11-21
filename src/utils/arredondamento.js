function arredondarDuasCasas(valor) {
  return Math.round((Number(valor) + Number.EPSILON) * 100) / 100;
}

module.exports = { arredondarDuasCasas };
