import './registerSw';
import './sentry';
import client from './client';
import { initNotifications } from './notifications';
import { initRequests } from './requests';
import { initRequests2 } from './requests2';
import { initConfig } from './config';

window.client = client;

initRequests(client);
initRequests2(client);
initConfig(client);
initNotifications(client);

export { client };
