import pino from 'pino';
import pretty from 'pino-pretty';
import moment from 'moment';

const logger = pino(
  pretty({
    customPrettifiers: {
      time: timestamp => moment(timestamp).format('DD/MM/YYYY HH:mm:ss'),
    },
    // messageFormat: '{levelLabel} - {pid} - url:{req.url}',
  }),
);

logger.level = 'debug';

export default logger;
