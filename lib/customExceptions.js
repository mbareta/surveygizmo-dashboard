function UserDataException(exceptions) {
  this.message = exceptions &&
    Object.keys(exceptions).reduce(
      (message, key) => buildExceptionMessage(message, exceptions[key][0].user_message),
      ''
    );
  this.name = 'UserDataException';
  Error.captureStackTrace(this, UserDataException);
}
UserDataException.prototype = Object.create(Error.prototype);
UserDataException.prototype.constructor = UserDataException;

const buildExceptionMessage = (message, messageToAppend) => {
  if (messageToAppend) {
    return `${message}\n ${messageToAppend}`;
  }

  return message;
};

module.exports = { UserDataException };
