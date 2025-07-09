/* eslint-disable linebreak-style */
const { UserSchema } = require('./schema');
const BadRequestError = require('../../exceptions/BadRequestError');

const UsersValidator = {
  validatePayload: (payload) => {
    const { error } = UserSchema.validate(payload);

    if (error){
      throw new BadRequestError(error.message);
    }
  }
};

module.exports = UsersValidator;