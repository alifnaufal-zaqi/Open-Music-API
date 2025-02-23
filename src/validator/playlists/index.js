const { PlaylistsPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
    validatePlaylistPayload: (payload) => {
        const { error } = PlaylistsPayloadSchema.validate(payload);

        if(error){
            throw new InvariantError(error.message);
        };
    },
};

module.exports = PlaylistsValidator;