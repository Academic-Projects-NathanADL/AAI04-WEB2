const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'AAI04 — API de Treinos',
      version: '1.0.0',
      description: 'API didática para cadastro de atletas, sessões e acompanhamento da carga semanal.'
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
    tags: [
      { name: 'Jogadores' }, { name: 'Treinos' }, { name: 'Configuração' }, { name: 'Relatórios' }
    ],
    components: {
      schemas: {
        Jogador: {
          type: 'object', required: ['nome', 'posicao'],
          properties: { id: { type: 'integer' }, nome: { type: 'string', minLength: 2, maxLength: 120 }, posicao: { type: 'string', enum: ['G', 'Z', 'M', 'A'] }, ativo: { type: 'boolean', default: true } }
        },
        TreinoEntrada: {
          type: 'object', required: ['codigo', 'jogadorId', 'dataTreino', 'tipo', 'duracaoMin', 'intensidade'],
          properties: { codigo: { type: 'string', example: 'TR-001' }, jogadorId: { type: 'integer' }, dataTreino: { type: 'string', format: 'date' }, tipo: { type: 'string', enum: ['F', 'T', 'E'] }, duracaoMin: { type: 'integer', minimum: 1 }, intensidade: { type: 'integer', minimum: 1, maximum: 10 } }
        },
        ConfiguracaoEntrada: {
          type: 'object', required: ['cargaMaximaSemanal'],
          properties: { cargaMaximaSemanal: { type: 'number', minimum: 0, example: 250 }, dataVigencia: { type: 'string', format: 'date', nullable: true } }
        },
        Erro: { type: 'object', properties: { erro: { type: 'string' } } }
      }
    },
    paths: {
      '/jogadores': {
        post: { tags: ['Jogadores'], summary: 'Cadastrar jogador', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Jogador' } } } }, responses: { 201: { description: 'Jogador cadastrado' }, 400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } } } } },
        get: { tags: ['Jogadores'], summary: 'Listar jogadores', responses: { 200: { description: 'Lista de jogadores' } } }
      },
      '/jogadores/{id}': {
        get: { tags: ['Jogadores'], summary: 'Consultar jogador e histórico', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Jogador encontrado' }, 404: { description: 'Jogador inexistente' } } },
        put: { tags: ['Jogadores'], summary: 'Atualizar jogador', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Jogador' } } } }, responses: { 200: { description: 'Jogador atualizado' }, 404: { description: 'Jogador inexistente' } } }
      },
      '/jogadores/{id}/desativar': { patch: { tags: ['Jogadores'], summary: 'Desativar jogador sem apagar o histórico', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Jogador desativado' }, 404: { description: 'Jogador inexistente' } } } },
      '/treinos': {
        post: { tags: ['Treinos'], summary: 'Registrar treino e calcular sua carga', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TreinoEntrada' } } } }, responses: { 201: { description: 'Treino criado com carga calculada' }, 400: { description: 'Dados inválidos ou jogador inativo' }, 404: { description: 'Jogador inexistente' }, 409: { description: 'Código duplicado' } } },
        get: { tags: ['Treinos'], summary: 'Listar e filtrar treinos', parameters: [{ in: 'query', name: 'jogadorId', schema: { type: 'integer' } }, { in: 'query', name: 'tipo', schema: { type: 'string', enum: ['F', 'T', 'E'] } }, { in: 'query', name: 'de', schema: { type: 'string', format: 'date' } }, { in: 'query', name: 'ate', schema: { type: 'string', format: 'date' } }], responses: { 200: { description: 'Lista de sessões com jogador' }, 400: { description: 'Filtro inválido' } } }
      },
      '/treinos/jogador/{id}': { get: { tags: ['Treinos'], summary: 'Listar treinos de um jogador', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Lista de sessões' }, 400: { description: 'ID inválido' } } } },
      '/treinos/{codigo}': { delete: { tags: ['Treinos'], summary: 'Excluir treino pelo código', parameters: [{ in: 'path', name: 'codigo', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Treino excluído' }, 404: { description: 'Treino inexistente' } } } },
      '/configuracao': {
        get: { tags: ['Configuração'], summary: 'Consultar limite semanal vigente', responses: { 200: { description: 'Configuração vigente' }, 404: { description: 'Configuração inexistente' } } },
        put: { tags: ['Configuração'], summary: 'Cadastrar limite semanal com início de vigência', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ConfiguracaoEntrada' } } } }, responses: { 201: { description: 'Configuração criada' }, 400: { description: 'Limite inválido' } } }
      },
      '/relatorios/semanal': { get: { tags: ['Relatórios'], summary: 'Gerar relatório semanal (segunda a domingo)', parameters: [{ in: 'query', name: 'data', required: true, description: 'Data de referência no formato YYYY-MM-DD', schema: { type: 'string', format: 'date', example: '2026-10-05' } }], responses: { 200: { description: 'Resumo, rankings, risco, médias por tipo e posição' }, 400: { description: 'Data inválida' }, 409: { description: 'Limite semanal ainda não configurado' } } } }
    }
  },
  apis: []
});
