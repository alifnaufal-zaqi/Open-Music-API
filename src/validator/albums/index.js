const BadRequestError = require('../../exceptions/BadRequestError');
const { AlbumSchema } = require('./schema');

const AlbumValidator = {
  validatePayload: (payload) => {
    const { error } = AlbumSchema.validate(payload);

    if (error){
      throw new BadRequestError(error.message);
    }
  }
};

module.exports = AlbumValidator;