import 'dotenv/config';
import HustComponent from 'hust-component';
import logger from '../utils/logger';

const { BASE_SERVICE_NAME, NODE_ENV } = process.env;
const queueName = `${BASE_SERVICE_NAME}:${NODE_ENV}`;
const workerId = process.pid;

const { createRedisConnection } = HustComponent.Helper.Redis;

// Criando uma instância do cliente Redis
const redisClient = createRedisConnection();

// Função para atualizar a presença do worker no Redis
const updateWorkerPresence = async () => {
  try {
    await redisClient.set(`worker:${queueName}:${workerId}`, '', { EX: 60 });
  } catch (err: any) {
    logger.error(`Erro ao atualizar a presença do worker: ${err.message}`);
  }
};

logger.debug(`Iniciando Worker [${BASE_SERVICE_NAME}] no ambiente [${NODE_ENV}]`);

// Conectando ao servidor Redis e atualizando a presença do worker regularmente
redisClient
  .connect()
  .then(async () => {
    logger.info(`Conectado ao servidor redis!`);

    // Atualizar a presença do worker imediatamente e a cada 30 segundos
    await updateWorkerPresence();
    setInterval(updateWorkerPresence, 30 * 1000);
  })
  .catch((err: any) => {
    logger.error(`Erro ao conectar ao servidor Redis: ${err.message}`);
    process.exit(1);
  });

export default { serviceName: BASE_SERVICE_NAME, queueName, workerId };
