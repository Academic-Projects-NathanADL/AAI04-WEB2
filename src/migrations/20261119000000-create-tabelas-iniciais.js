'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jogadores', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nome: { allowNull: false, type: Sequelize.STRING(120) },
      posicao: { allowNull: false, type: Sequelize.ENUM('G', 'Z', 'M', 'A') },
      ativo: { allowNull: false, defaultValue: true, type: Sequelize.BOOLEAN },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
    await queryInterface.createTable('configuracoes', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      carga_maxima_semanal: { allowNull: false, type: Sequelize.DECIMAL(10, 2) },
      data_vigencia: { allowNull: true, type: Sequelize.DATEONLY },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
    await queryInterface.createTable('treinos', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      codigo: { allowNull: false, unique: true, type: Sequelize.STRING(40) },
      jogador_id: { allowNull: false, type: Sequelize.INTEGER, references: { model: 'jogadores', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      data_treino: { allowNull: false, type: Sequelize.DATEONLY },
      tipo: { allowNull: false, type: Sequelize.ENUM('F', 'T', 'E') },
      duracao_min: { allowNull: false, type: Sequelize.INTEGER },
      intensidade: { allowNull: false, type: Sequelize.INTEGER },
      carga: { allowNull: false, type: Sequelize.DECIMAL(10, 2) },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
    await queryInterface.addIndex('treinos', ['jogador_id', 'data_treino'], { name: 'treinos_jogador_data_idx' });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('treinos');
    await queryInterface.dropTable('configuracoes');
    await queryInterface.dropTable('jogadores');
  }
};
