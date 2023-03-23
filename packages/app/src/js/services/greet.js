import { client } from '../core';

export const greet = () => async () => client.send({ type: 'greet:send' });
