class AppError extends Error {
  constructor(code, msg = '') {
    super(`[${code}] ${msg instanceof Error ? msg.message : msg}`);
    this.errorCode = code;
    this.cause = msg;
  }

  toJSON = () => ({
    errorCode: this.errorCode,
    message: this.message,
  });
}

module.exports = {
  SessionTerminated: (msg) => new AppError('SESSION_TERMINATED', msg),
  SessionNotFound: (msg) => new AppError('SESSION_NOT_FOUND', msg),
  AccessDenied: (msg) => new AppError('ACCESS_DENIED', msg),
  ValidationError: (msg) => new AppError('VALIDATION_ERROR', msg),
  UnknownCommand: (msg) => new AppError('UNKNOWN_COMMAND', msg),
  UnknownOp: (msg) => new AppError('UNKNOWN_OP', msg),
  UnknownError: (err) => new AppError('UNKNOWN_ERROR', err),
};
