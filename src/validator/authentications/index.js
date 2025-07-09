/* eslint-disable linebreak-style */
const { PostAuthenticationPayload, PutAuthenticationPayload, DeleteAuthenticationPayload } = require('./schema');
const BadRequestError = require('../../exceptions/BadRequestError');

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const { error } = PostAuthenticationPayload.validate(payload);

    if (error){
      throw new BadRequestError(error.message);
    }
  },
  validatePutAuthenticationPayload: (payload) => {
    const { error } = PutAuthenticationPayload.validate(payload);

    if (error){
      throw new BadRequestError(error.message);
    }
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const { error } = DeleteAuthenticationPayload.validate(payload);

    if (error){
      throw new BadRequestError(error.message);
    }
  }
};

module.exports = AuthenticationsValidator;