
export class ApiError extends Error {
  errorCode: string;
  status: number;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.errorCode = code;
    this.status = status;
  }
}

export class ResourceNotFound extends ApiError {
  constructor(message: string) {
    super(404, 'ResourceNotFound', message);
  }
}

export class AccessDenied extends ApiError {
  constructor(message: string) {
    super(401, 'AccessDenied', message);
  }
}

