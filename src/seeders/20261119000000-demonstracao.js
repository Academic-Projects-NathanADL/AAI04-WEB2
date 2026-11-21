'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('jogadores', [
      { id: 1, nome: 'Ana Souza', posicao: 'G', ativo: true, created_at: now, updated_at: now },
      { id: 2, nome: 'Bruno Lima', posicao: 'Z', ativo: true, created_at: now, updated_at: now },
      { id: 3, nome: 'Caio Mendes', posicao: 'Z', ativo: true, created_at: now, updated_at: now },
      { id: 4, nome: 'Davi Rocha', posicao: 'M', ativo: true, created_at: now, updated_at: now },
      { id: 5, nome: 'Enzo Alves', posicao: 'M', ativo: true, created_at: now, updated_at: now },
      { id: 6, nome: 'Felipe Costa', posicao: 'A', ativo: true, created_at: now, updated_at: now }
    ]);
    await queryInterface.bulkInsert('configuracoes', [
      { id: 1, carga_maxima_semanal: 170, data_vigencia: '2026-09-28', created_at: now, updated_at: now }
    ]);
    const rows = [
      ['DEMO-001', 1, '2026-10-05', 'T', 60, 5], ['DEMO-002', 1, '2026-10-07', 'F', 60, 6], ['DEMO-003', 1, '2026-10-10', 'E', 45, 4],
      ['DEMO-004', 2, '2026-10-05', 'F', 60, 8], ['DEMO-005', 2, '2026-10-08', 'T', 45, 6], ['DEMO-006', 2, '2026-10-10', 'E', 30, 5],
      ['DEMO-007', 3, '2026-10-06', 'F', 45, 5], ['DEMO-008', 3, '2026-10-09', 'T', 60, 5], ['DEMO-009', 3, '2026-10-11', 'E', 30, 4],
      ['DEMO-010', 4, '2026-10-05', 'T', 60, 7], ['DEMO-011', 4, '2026-10-07', 'F', 60, 8], ['DEMO-012', 4, '2026-10-10', 'E', 45, 7],
      ['DEMO-013', 5, '2026-10-06', 'F', 45, 6], ['DEMO-014', 5, '2026-10-09', 'T', 60, 6], ['DEMO-015', 5, '2026-10-11', 'E', 30, 5],
      ['DEMO-016', 6, '2026-10-05', 'F', 60, 9], ['DEMO-017', 6, '2026-10-07', 'T', 60, 8], ['DEMO-018', 6, '2026-10-09', 'E', 45, 8],
      ['DEMO-019', 1, '2026-10-12', 'F', 45, 5], ['DEMO-020', 2, '2026-10-15', 'T', 60, 6]
    ];
    const multiplicador = { F: 1.5, T: 1.2, E: 1.0 };
    await queryInterface.bulkInsert('treinos', rows.map(([codigo, jogador_id, data_treino, tipo, duracao_min, intensidade], index) => ({
      id: index + 1, codigo, jogador_id, data_treino, tipo, duracao_min, intensidade,
      carga: ((duracao_min / 10) * intensidade * multiplicador[tipo]).toFixed(2), created_at: now, updated_at: now
    })));
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('treinos', { codigo: { [Sequelize.Op.like]: 'DEMO-%' } });
    await queryInterface.bulkDelete('configuracoes', { id: 1 });
    await queryInterface.bulkDelete('jogadores', { id: [1, 2, 3, 4, 5, 6] });
  }
};
