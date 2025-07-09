/* eslint-disable linebreak-style */
const Jwt = require('@hapi/jwt');
const BadRequestError = require('../exceptions/BadRequestError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);

      const { payload } = artifacts.decoded;
      return payload;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      throw new BadRequestError('Refresh token tidak valid');
    }
  }
};

module.exports = TokenManager;