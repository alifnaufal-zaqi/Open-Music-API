const { SongSchema } = require('./schema');
const BadRequestError = require('../../exceptions/BadRequestError');

const SongValidator = {
  validatePayload: (payload) => {
    const { error } = SongSchema.validate(payload);

    if (error){
      throw new BadRequestError(error.message);
    }
  }
};

module.exports = SongValidator;