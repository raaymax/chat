const Err = (code, msg) => new class extends Error {
  constructor() {
    super(`[${code}] ${msg}`);
    this.errorCode = code;
  }
}();

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
    .on('setSession', handleSession)
    .on('rmSession', handleLogout);
};

async function connectionReady(client) {
  try {
    const sess = session.get();
    if (sess) {
      await restoreSession(client);
    } else {
      await client.emit('auth:none');
    }
  } catch (err) {
    if (err.errorCode === 'SESSION_NOT_RESTORED') {
      await client.emit('auth:none');
    } else {
      await client.emit('auth:error', err);
    }
  } finally {
    await client.emit('auth:ready');
  }
}

async function handleSession(client, msg) {
  session.set(msg.session);
  client.emit('auth:user', msg.user);
}
async function handleLogout(client) {
  session.set(null);
  client.emit('auth:logout');
}

async function restoreSession(client, i = 1) {
  if (i > 10) throw Err('SESSION_RETRY_FAILED');
  // eslint-disable-next-line no-console
  console.log('Restore session attempt', i);
  try {
    const sess = session.get();
    if (sess) {
      await client.emit('message:remove', 'session');
      await client.req({ type: 'restore', session: sess });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    await client.emit('message', {
      priv: true,
      clientId: 'session',
      notifType: 'warning',
      notif: 'User session not restored',
      createdAt: new Date(),
    });
    const errorCode = err?.data?.errorCode;
    if (errorCode !== 'SESSION_TERMINATED' && errorCode !== 'SESSION_NOT_FOUND') {
      return new Promise((resolve, reject) => {
        setTimeout(() => restoreSession(client, i + 1).then(resolve, reject), 2000);
      });
    }
    session.clear();
    throw Err('SESSION_NOT_RESTORED');
  }
}
