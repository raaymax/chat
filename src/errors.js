class AppError extends Error {
  constructor(code, msg = '') {
    super(`[${code}] ${msg}`);
    this.errorCode = code;
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
};
