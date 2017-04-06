function UserDataException(exceptions) {
  this.message = exceptions &&
    Object.keys(exceptions).reduce(
      (message, key) => `${message}\n ${exceptions[key][0].user_message}`,
      ''
    );
  this.name = 'UserDataException';
  Error.captureStackTrace(this, UserDataException);
}
UserDataException.prototype = Object.create(Error.prototype);
UserDataException.prototype.constructor = UserDataException;

module.exports = { UserDataException };
