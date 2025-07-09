const { ImageHeadersSchema } = require('./schema');
const BadRequestError = require('../../exceptions/BadRequestError');

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const { error } = ImageHeadersSchema.validate(headers);

    if (error){
      throw new BadRequestError(error.message);
    }
  }
};

module.exports = UploadsValidator;