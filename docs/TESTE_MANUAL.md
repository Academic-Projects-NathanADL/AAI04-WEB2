# Roteiro de testes manuais pela API / Swagger

Execute `npm run db:migrate` e `npm run db:seed`, inicie o servidor e abra `http://localhost:3000/api-docs`. A seed usa códigos `DEMO-001` a `DEMO-020`; para repetir os cenários, use novos códigos ou rode `npm run db:seed:undo` seguido de `npm run db:seed`.

| Caso | Requisição | Resultado esperado |
| --- | --- | --- |
| Sessão com carga conferida | `POST /treinos`, 60 min, intensidade 8, tipo `F` | `201`, `carga: 72` |
| Código duplicado | Repetir o mesmo código de treino | `409`, mensagem genérica de valor único |
| Intensidade abaixo do limite | `POST /treinos` com intensidade `0` | `400`, mensagem de validação |
| Intensidade acima do limite | `POST /treinos` com intensidade `11` | `400`, mensagem de validação |
| Duração não positiva | `POST /treinos` com `duracaoMin: 0` | `400`, mensagem de validação |
| Jogador inexistente | `POST /treinos` com `jogadorId` que não existe | `404` |
| Jogador inativo | `PATCH /jogadores/:id/desativar`, depois `POST /treinos` para esse id | Desativação `200`; cadastro `400`; histórico mantido |
| Consulta por filtros | `GET /treinos?jogadorId=6&tipo=F&de=2026-10-05&ate=2026-10-11` | `200`, somente sessões correspondentes, com jogador incluído |
| Excluir código ausente | `DELETE /treinos/INEXISTENTE` | `404` |
| Semana 05–11/10 | `GET /relatorios/semanal?data=2026-10-07` | `200`, total 18; atacante acima de 170; indicadores por tipo e posição |
| Semana 12–18/10 | `GET /relatorios/semanal?data=2026-10-14` | `200`, dois treinos; indicadores distintos da semana anterior |
| Data inválida | `GET /relatorios/semanal?data=2026-02-30` | `400` |

O seed usa intensidade/duração e multiplicadores da regra para persistir a carga calculada. Exemplo manual: `60 / 10 × 8 × 1,5 = 72`. O relatório só marca risco quando a carga semanal é maior que o limite; a igualdade não gera risco. Os rankings mostram todos os atletas empatados e incluem somente quem treinou na semana.

Para a evidência final, salve capturas de `/api-docs` mostrando: a resposta `201` com carga 72, o `400` da intensidade inválida, o `409` do código duplicado, e o JSON do relatório com o atleta em risco. A especificação pode também ser exportada por `GET /api-docs.json`.
