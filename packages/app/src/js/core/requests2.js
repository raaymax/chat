export function initRequests2(client) {
  const ID = (Math.random() + 1).toString(36);
  let nextSeq = 0;

  const genSeqId = () => `${ID}:${nextSeq++}`;

  class Request {
    static send = async (msg) => (new Request(msg)).send()

    static STATUS_CREATED = 'created';

    static STATUS_IN_PROGRESS = 'in_progress';

    static STATUS_SUCCESS = 'success';

    static STATUS_ERROR = 'error';

    static STATUS_TIMEOUT = 'timeout';

    #timeout = null;

    #resolve = null;

    #reject = null;

    #closed = false;

    constructor(msg) {
      this.req = msg;
      this.res = null;
      this.seqId = msg.seqId || genSeqId();
      this.status = Request.STATUS_CREATED;
      this.data = [];
    }

    wait() {
      return new Promise((resolve, reject) => {
        this.#closed = false;
        this.#resolve = resolve;
        this.#reject = reject;
        this.#timeout = setTimeout(() => {
          this.close();
          const err = new Error('TIMEOUT');
          Object.assign(err, {
            type: 'response', seqId: this.seqId, status: 'timeout',
          });
          this.status = Request.STATUS_TIMEOUT;
          this.#reject(this);
        }, 4000);
      });
    }

    addPart(msg) {
      this.data.push(msg);
    }

    finish(msg) {
      this.res = msg;
      //console.log('fin', this, msg);
      if (this.closed) return;
      clearTimeout(this.#timeout);
      this.close();
      if (msg.status === 'ok') {
        this.status = Request.STATUS_SUCCESS;
        this.#resolve(this);
      } else {
        this.status = Request.STATUS_ERROR;
        this.#reject(this);
      }
    }

    close() {
      this.#closed = true;
      client.offSeq(this.seqId, this.handle);
    }

    handle = (msg) => {
      if (this.#closed) return;
      if (msg.seqId !== this.seqId) return;
      if (msg.type === 'response') return this.finish(msg);
      this.addPart(msg);
    }

    send() {
      this.status = Request.STATUS_IN_PROGRESS;
      client.onSeq(this.seqId, this.handle);
      //console.log('req', { ...this.req, seqId: this.seqId })
      client.send({ ...this.req, seqId: this.seqId });
      return this.wait();
    }
  }

  Object.assign(client, { Request, req2: Request.send });
}
