import './registerSw';
import './sentry';
import client from './client';
import { initNotifications } from './notifications';
import { initRequests } from './requests';
import { initConfig } from './config';
import { initStatus } from './status';

window.client = client;

initRequests(client);
initConfig(client);
initNotifications(client);
initStatus(client);

export { client };
