module.exports = {
  MissingChannel: () => new Error('MISSING_CHANNEL'),
  MissingToken: () => new Error('MISSING_TOKEN'),
  MissingMessage: () => new Error('MISSING_MESSAGE'),
  MissingId: () => new Error('MISSING_ID'),
  MissingFlat: () => new Error('MISSING_FLAT'),

  MessageNotExist: () => new Error('MESSAGE_NOT_EXIST'),
  NotOwnerOfMessage: () => new Error('NOT_OWNER_OF_MESSAGE'),
  AccessDenied: () => new Error('ACCESS_DENIED'),
  NotOwnerOfMessage: () => new Error('NOT_OWNER_OF_MESSAGE'),
};
