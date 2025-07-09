const ClientError = require('./ClientError');

class BadRequestError extends ClientError{
  constructor(message){
    super(message);
    this.name = 'BadRequestError';
  }
}

module.exports = BadRequestError;