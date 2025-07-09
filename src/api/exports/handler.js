class ExportsHandler {
  constructor(producerServices, playlistsServices, validator){
    this._producerServices = producerServices;
    this._playlistsServices = playlistsServices;
    this._validator = validator;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h){
    this._validator.validateExportPlaylistsPayload(request.payload);

    const { id: userId } = request.auth.credentials;
    const { targetEmail } = request.payload;
    const { id: playlistId } = request.params;

    const message = {
      playlistId,
      targetEmail,
    };

    await this._playlistsServices.verifyPlaylistOwner(playlistId, userId);
    await this._producerServices.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan anda sedang kami proses',
    });
    response.code(201);

    return response;
  }
}

module.exports = ExportsHandler;