const BadRequestError = require('../../exceptions/BadRequestError');
const { PlaylistSchema, PlaylistSongSchema } = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const { error } = PlaylistSchema.validate(payload);

    if (error){
      throw new BadRequestError(error.message);
    }
  },
  validatePlaylistSongPayload: (payload) => {
    const { error } = PlaylistSongSchema.validate(payload);

    if (error){
      throw new BadRequestError(error.message);
    }
  }
};

module.exports = PlaylistsValidator;