import './registerSw';
import './sentry';
import client from './client';
import { initNotifications } from './notifications';
import { initPing } from './ping';
import { initRequests } from './requests';
import { initConfig } from './config';
import { initAuth } from './auth';
import { initStatus } from './status';

window.client = client;

initRequests(client);
initConfig(client);
initAuth(client);
initNotifications(client);
initStatus(client);
initPing(client);

export {client};
