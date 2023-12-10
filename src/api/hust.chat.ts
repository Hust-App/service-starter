import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import HustComponent from 'hust-component';
import logger from '../utils/logger';
import { queueName } from '../services/inicializeWorkerPresence';

const { generateToken } = HustComponent.Helper.Security;
const baseURL = process.env.API_BASE_URL || `https://api.macrochat.com.br/v2`;
const api = axios.create({ baseURL });

api.interceptors.request.use((req: InternalAxiosRequestConfig) => {
  req.headers.authorization = `Bearer ${generateToken({ system: true, application: queueName })}`;
  return req;
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  e => {
    if (e.response) logger.error(`Request failed with status code ${e.response.status}`);
    else if (e.request) logger.error(`No response was received ${e.request}`);
    else logger.error(`e setting up the request ${e.message}`);

    throw e;
  },
);

export default api;
