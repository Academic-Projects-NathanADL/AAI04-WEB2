require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const port = Number(process.env.PORT || 3000);

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    const server = app.listen(port, () => console.log(`API disponível em http://localhost:${port}`));
    const encerrar = async () => {
      server.close(async () => {
        await sequelize.close();
        process.exit(0);
      });
    };
    process.on('SIGINT', encerrar);
    process.on('SIGTERM', encerrar);
  } catch (error) {
    console.error('Não foi possível conectar ao banco MySQL. Confira o .env e as migrations.');
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) iniciarServidor();
module.exports = iniciarServidor;
