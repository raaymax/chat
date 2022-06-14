import './registerSw';
import './sentry';
import client from './client';
import { initNotifications } from './notifications';
import { initRequests } from './requests';
import { initConfig } from './config';

window.client = client;

initRequests(client);
initConfig(client);
initNotifications(client);

export { client };
