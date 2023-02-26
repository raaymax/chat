import { WebSocketTransport } from './transport';
import { SequenceMessage, ResponseMessage, RequestMessage } from './types';

function genSeqId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export class Request {
  static send = async (msg: RequestMessage, transport: WebSocketTransport) => (new Request(msg, transport)).send();

  static STATUS_CREATED = 'created';

  static STATUS_IN_PROGRESS = 'in_progress';

  static STATUS_SUCCESS = 'success';

  static STATUS_ERROR = 'error';

  static STATUS_TIMEOUT = 'timeout';

  status: string = Request.STATUS_CREATED;
  
  data: SequenceMessage[];
  
  seqId = genSeqId();

  res: ResponseMessage = null

  private timeout = null;

  private resolve = null;

  private reject = null;

  private closed = false;

  constructor(private req: RequestMessage, private transport: WebSocketTransport){
      this.res = null;
      this.seqId = genSeqId();
      this.status = Request.STATUS_CREATED;
      this.data = [];
  }


  async wait(): Promise<ResponseMessage> {
    return new Promise((resolve, reject) => {
      this.closed = false;
      this.resolve = resolve;
      this.reject = reject;
      this.timeout = setTimeout(() => {
        this.close();
        const err = new Error('TIMEOUT');
        Object.assign(err, {
          type: 'response', seqId: this.seqId, status: 'timeout',
        });
        this.status = Request.STATUS_TIMEOUT;
        this.reject(this);
      }, 4000);
    });
  }

  addPart(msg: SequenceMessage) {
    this.data.push(msg);
  }

  finish(msg: ResponseMessage) {
    this.res = msg;
    // console.log('fin', this, msg);
    if (this.closed) return;
    clearTimeout(this.timeout);
    this.close();
    if (msg.status === 'ok') {
      this.status = Request.STATUS_SUCCESS;
      this.resolve(this);
    } else {
      this.status = Request.STATUS_ERROR;
      this.reject(this);
    }
  }

  close() {
    this.closed = true;
    this.transport.offSeq(this.seqId);
  }

  handle = (msg: SequenceMessage) => {
    if (this.closed) return;
    if (msg.seqId !== this.seqId) return;
    if (msg.type == 'response') return this.finish(msg as ResponseMessage);
    this.addPart(msg);
  }

  async send(): Promise<ResponseMessage> {
    this.status = Request.STATUS_IN_PROGRESS;
    this.transport.onSeq(this.seqId, this.handle);
    // console.log('req', { ...this.req, seqId: this.seqId })
    this.transport.send({ ...this.req, seqId: this.seqId });
    return this.wait();
  }
}
