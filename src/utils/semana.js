function inicioDaSemana(data) {
  const [year, month, day] = data.split('-').map(Number);
  const inicio = new Date(Date.UTC(year, month - 1, day));
  const dia = inicio.getUTCDay();
  inicio.setUTCDate(inicio.getUTCDate() - ((dia + 6) % 7));
  const fim = new Date(inicio);
  fim.setUTCDate(fim.getUTCDate() + 6);
  return { inicio: inicio.toISOString().slice(0, 10), fim: fim.toISOString().slice(0, 10) };
}

function validarData(data) {
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const parsed = new Date(`${data}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === data;
}

module.exports = { inicioDaSemana, validarData };
