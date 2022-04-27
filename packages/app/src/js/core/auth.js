const session = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem('session'));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return null;
    }
  },
  set: (session) => {
    localStorage.setItem('session', JSON.stringify(session));
  },
  clear: () => {
    localStorage.removeItem('session');
  },
};

export const initAuth = (client) => {
  client
    .on('config:ready', connectionReady)
    .on('op:setSession', handleSession);
}

async function connectionReady(client) {
  try {
    const sess = session.get();
    if (sess) {
      await restoreSession(client);
    } else {
      await client.emit('auth:none');
    }
  } catch (err) {
    await client.emit('auth:error', err);
  } finally {
    await client.emit('auth:ready');
  }
}

async function handleSession(client, msg) {
  session.set(msg.op.session);
  client.emit('auth:user', msg.op.user);
}

async function restoreSession(client, i = 1) {
  if (i > 10) throw new Error('SESSION_NOT_RESTORED');
  // eslint-disable-next-line no-console
  console.log('Restore session attempt', i);
  try {
    const sess = session.get();
    if (sess) {
      await client.emit('message:remove', 'session');
      await client.req({ op: { type: 'restore', session: sess} });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    await client.emit('message', {
      clientId: 'session', notifType: 'warning', notif: 'User session not restored', createdAt: new Date(),
    });
    const errorCode = err?.resp?.data?.errorCode;
    if (errorCode !== 'SESSION_TERMINATED' && errorCode !== 'SESSION_NOT_FOUND') {
      return new Promise((resolve, reject) => {
        setTimeout(() => restoreSession(client, i + 1).then(resolve, reject), 2000);
      });
    }
    throw new Error('SESSION_NOT_RESTORED');
  }
}
