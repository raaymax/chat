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

export class AccessDenied extends AppError {
  constructor() {
    super("ACCESS_DENIED", "Access denied");
  }
}

export class NotOwner extends AppError {
  constructor() {
    super("NOT_OWNER", "Not owner");
  }
}

export class InvalidMessage extends AppError {
  constructor(msg = "Invalid message") {
    super("INVALID_MESSAGE", msg);
  }
}
