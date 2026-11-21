# AAI04 — API de acompanhamento de treinos

API REST didática para cadastro de jogadores, registro de treinos e consolidação da carga semanal. O indicador **RISCO DE SOBRECARGA** existe apenas para esta atividade; não é diagnóstico nem previsão clínica de lesão.

## Requisitos

- Node.js 18 ou superior e npm.
- MySQL 8 (ou versão compatível com Sequelize 6).
- Banco `aai04_treinos` criado no MySQL antes das migrations.

## Instalação e execução

1. Copie `.env.example` para `.env` e informe host, porta, nome do banco, usuário e senha. O `.env` não deve ser enviado ao Git.
2. Crie o banco vazio no MySQL, por exemplo: `CREATE DATABASE aai04_treinos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`.
3. Instale as dependências: `npm install`.
4. Crie as tabelas com as migrations: `npm run db:migrate`.
5. (Opcional) Insira seis jogadores e vinte treinos de demonstração: `npm run db:seed`.
6. Inicie a API com `npm run dev` ou `npm start`.
7. Acesse o Swagger em <http://localhost:3000/api-docs> e a especificação OpenAPI em <http://localhost:3000/api-docs.json>.

Para desfazer a massa de demonstração, use `npm run db:seed:undo`; para desfazer a última migration, use `npm run db:migrate:undo`. As migrations usam Sequelize CLI. A aplicação não chama `sync({ force: true })` e não recria tabelas ao iniciar.

## Endpoints

| Método | Endpoint | Ação |
| --- | --- | --- |
| `POST` | `/jogadores` | Cadastrar jogador |
| `GET` | `/jogadores` | Listar jogadores |
| `GET` | `/jogadores/:id` | Consultar jogador e histórico |
| `PUT` | `/jogadores/:id` | Atualizar jogador |
| `PATCH` | `/jogadores/:id/desativar` | Desativar sem apagar treinos |
| `GET` / `PUT` | `/configuracao` | Consultar ou criar limite semanal com vigência |
| `POST` | `/treinos` | Registrar treino e calcular carga |
| `GET` | `/treinos` | Listar com filtros `jogadorId`, `tipo`, `de`, `ate` |
| `GET` | `/treinos/jogador/:id` | Consultar treinos de um jogador |
| `DELETE` | `/treinos/:codigo` | Excluir pelo código |
| `GET` | `/relatorios/semanal?data=2026-10-07` | Gerar relatório da segunda a domingo da data indicada |

### Exemplos de requisição

Cadastrar jogador:

```http
POST /jogadores
Content-Type: application/json

{"nome":"João Silva","posicao":"M"}
```

Cadastrar limite aplicável a partir de uma data:

```http
PUT /configuracao
Content-Type: application/json

{"cargaMaximaSemanal":170,"dataVigencia":"2026-10-01"}
```

Registrar sessão física de 60 minutos com intensidade 8. A resposta contém `carga: 72`:

```http
POST /treinos
Content-Type: application/json

{"codigo":"TR-001","jogadorId":1,"dataTreino":"2026-10-07","tipo":"F","duracaoMin":60,"intensidade":8}
```

Filtrar e consultar o relatório:

```http
GET /treinos?jogadorId=1&tipo=F&de=2026-10-05&ate=2026-10-11
GET /relatorios/semanal?data=2026-10-07
```

## Regras de negócio

| Tipo | Significado | Multiplicador |
| --- | --- | ---: |
| `F` | Físico | 1,5 |
| `T` | Técnico | 1,2 |
| `E` | Estratégico | 1,0 |

`carga = (duraçãoMin / 10) × intensidade × multiplicador`. Intensidade deve ser inteira de 1 a 10 e duração deve ser inteira positiva. Somente jogadores ativos podem receber novos treinos. Código de treino é único. A carga do jogador é a soma dos treinos de segunda a domingo; o risco aparece somente se a soma for **estritamente maior** que o limite aplicável no início daquela semana. Igualdade ao limite não gera risco.

O relatório inclui totais, carga e quantidade por jogador, todos os empates de maior e menor carga, jogadores acima do limite, média por tipo e quantidade/média por posição. Rankings consideram jogadores com pelo menos um treino na semana. Semana sem treinos retorna totais e listas vazias, com `semanaSemTreinos: true`. A configuração tem histórico por `dataVigencia`, e uma alteração não reescreve a vigência anterior.

## Organização e explicação técnica

- `src/models`: models `Jogador`, `Treino` e `Configuracao`, validações e associações `hasMany` / `belongsTo`.
- `src/controllers`: tradução de requisições HTTP para respostas JSON.
- `src/services`: regra de cálculo e consolidação de relatório.
- `src/routes`: endpoints Express.
- `src/config`: conexão MySQL via Sequelize e configuração do CLI.
- `src/migrations` e `src/seeders`: schema versionado e massa demonstrativa.
- `src/docs/swagger.js`: contrato OpenAPI exibido pela interface Swagger UI.

O acesso da aplicação aos dados usa Sequelize e `async/await` em controllers e serviços. O relatório usa `include` para os dados do jogador, `Op.between` para o intervalo semanal, `fn`/`col` e `group` para agregações por tipo e posição. Consultas individuais e filtros usam `findByPk`, `findOne` e `findAll`; gravações usam `create` e `update`; a exclusão verifica a instância antes de `destroy`. SQL aparece somente nas migrations/seeds controladas pelo CLI, não nas operações das rotas.

As rotas devolvem `201` em criações, `200` em consultas/alterações/exclusões, `400` para dados inválidos, `404` para registros ausentes, `409` para código duplicado ou relatório sem configuração aplicável, e `500` para falhas inesperadas. Erros internos retornam mensagem genérica sem credenciais ou detalhes da conexão.

## Testes e evidências Swagger

Execute os testes unitários com `npm test`. Eles cobrem fórmula e multiplicadores, intensidade/duração/tipo inválidos e limites de semana/calendário. Para validar persistência e respostas HTTP, aplique a migration, execute a seed e percorra os casos de [`docs/TESTE_MANUAL.md`](docs/TESTE_MANUAL.md) pelo botão **Try it out** em `/api-docs`. Guarde capturas das respostas de criação, validação, duplicidade e relatório semanal como evidências da entrega.

Os dados de demonstração contêm seis atletas nas quatro posições, vinte treinos F/T/E em duas semanas, e limite semanal 170. Na semana de 05 a 11/10/2026, o atleta de ataque tem carga 174,60 e deve aparecer em risco; as sessões também permitem comparar a semana seguinte.
