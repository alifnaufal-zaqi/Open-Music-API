/* eslint-disable linebreak-style */
class AuthenticationsHandler{
  constructor(authenticationsService, usersService, tokenManager, validator){
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h){
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this._usersService.verifyUserCredential(username, password);

    // Generate Token
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    // Store Refresh Token to Database
    await this._authenticationsService.insertRefreshToken(refreshToken);

    const respose = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      }
    });
    respose.code(201);

    return respose;
  }

  async putAuthenticationHandler(request){
    this._validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    // Generate new access token
    const accessToken = this._tokenManager.generateAccessToken({ id });

    return {
      status: 'success',
      message: 'Access token berhasil diperbarui',
      data: {
        accessToken,
      }
    };
  }

  async deleteAuthenticationHandler(request){
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken); // => Make sure refresh token exist in database
    await this._authenticationsService.deleteRefreshToken(refreshToken); // => Delete refresh token in database

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;