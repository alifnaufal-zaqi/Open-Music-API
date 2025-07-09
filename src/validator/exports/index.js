const BadRequestError = require('../../exceptions/BadRequestError');
const ExportPlaylistsPayloadSchema = require('./schema');

const ExportsValidator = {
  validateExportPlaylistsPayload: (payload) => {
    const { error } = ExportPlaylistsPayloadSchema.validate(payload);

    if (error){
      throw new BadRequestError(error.message);
    }
  }
};

module.exports = ExportsValidator;