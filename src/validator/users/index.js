const { UserPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const UsersValidator = {
    validateUserPayload: (payload) => {
        const { error } = UserPayloadSchema.validate(payload);

        if(error){
            throw new InvariantError(error.message);
        };
    },
};

module.exports = UsersValidator;