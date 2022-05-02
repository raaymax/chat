import './registerSw';
import './sentry';
import client from './client';
import { initNotifications } from './notifications';
import { initPing } from './ping';
import { initRequests } from './requests';
import { initConfig } from './config';
import { initAuth } from './auth';

window.client = client;

initRequests(client);
initConfig(client);
initAuth(client);
initNotifications(client);
initPing(client);

export {client};
