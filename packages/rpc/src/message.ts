import { WebSocketTransport } from './transport';
import { SequenceMessage, ResponseMessage, RequestMessage } from './types';
import { Event } from './event';
import { genSeqId } from './idGenerator';

export class Message {
  static STATUS_CREATED = 'created';

  static STATUS_IN_PROGRESS = 'in_progress';

  static STATUS_SUCCESS = 'success';

  static STATUS_ERROR = 'error';

  static STATUS_TIMEOUT = 'timeout';

  status: string = Message.STATUS_CREATED;

  seqId = genSeqId();

  res: ResponseMessage = null;

  private timeout = null;

  private resolve = null;

  private reject = null;

  private closed = false;

  constructor(private req: RequestMessage, private transport: WebSocketTransport) {
    this.res = null;
    this.seqId = genSeqId();
    this.status = Message.STATUS_CREATED;
  }

  isClosed(): boolean {
    return this.closed;
  }

  async wait(): Promise<ResponseMessage> {
    return new Promise((resolve, reject) => {
      this.closed = false;
      this.resolve = resolve;
      this.reject = reject;
      this.timeout = setTimeout(() => {
        this.close();
        this.status = Message.STATUS_TIMEOUT;
        this.reject(this);
      }, 4000);
    });
  }

  finish(msg: ResponseMessage) {
    this.res = msg;
    // console.log('fin', this, msg);
    if (this.closed) return;
    clearTimeout(this.timeout);
    this.close();
    if (msg.status === 'ok') {
      this.status = Message.STATUS_SUCCESS;
      this.resolve(this);
    } else {
      this.status = Message.STATUS_ERROR;
      this.reject(this);
    }
  }

  close() {
    this.closed = true;
    this.transport.offSeq(this.seqId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  processSequnce(_msg: SequenceMessage, _ev: Event): void {}

  handle = (msg: SequenceMessage, ev: Event) => {
    if (this.closed) return;
    if (msg.seqId !== this.seqId) return;
    if (msg.type === 'response') {
      ev.preventDefault();
      return this.finish(msg as ResponseMessage);
    }
    this.processSequnce(msg, ev);
  };

  async send(): Promise<ResponseMessage> {
    this.status = Message.STATUS_IN_PROGRESS;
    this.transport.onSeq(this.seqId, this.handle);
    // console.log('req', { ...this.req, seqId: this.seqId })
    this.transport.send({ ...this.req, seqId: this.seqId });
    return this.wait();
  }
}
