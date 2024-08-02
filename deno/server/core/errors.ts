
export class AppError extends Error {
  errorCode: string;
  constructor(public code: string, public message: string) {
    super(message);
    this.errorCode = code;
  }
}

export class ResourceNotFound extends AppError {
  constructor(message: string) {
    super("RESOURCE_NOT_FOUND", message);
  }
}
