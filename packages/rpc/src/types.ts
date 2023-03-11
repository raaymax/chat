export type Result<S,E> = S | E;

export type NotifMessage = {
  type: string;
}

export type ErrorMessage = {
  type: 'response';
  status: 'error';
  seqId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

export type SuccessMessage = {
  type: 'response';
  status: 'ok';
  seqId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export type ResponseMessage = Result<SuccessMessage, ErrorMessage>;

export type RequestMessage = {
  type: string;
  seqId: string | null;
}

export type DataMessage = {
  type: string;
  seqId: string;
}

export type SequenceMessage = ResponseMessage | RequestMessage | DataMessage;

export type Message = SequenceMessage | NotifMessage;

export const isMessage = (value: unknown): value is Message => (
  typeof value === 'object' 
    && value !== null 
    && 'type' in value 
    && typeof value.type === 'string'
);

export const isSequenceMessage = (value: Message): value is SequenceMessage => (
  'seqId' in value 
    && typeof value.seqId === 'string'
);
