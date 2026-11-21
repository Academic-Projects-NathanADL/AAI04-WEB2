const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const jogadorRoutes = require('./routes/jogadorRoutes');
const treinoRoutes = require('./routes/treinoRoutes');
const configuracaoRoutes = require('./routes/configuracaoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.use('/jogadores', jogadorRoutes);
app.use('/treinos', treinoRoutes);
app.use('/configuracao', configuracaoRoutes);
app.use('/relatorios', relatorioRoutes);
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
app.use(errorHandler);

module.exports = app;
