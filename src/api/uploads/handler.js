const config = require('../../utils/config');

class UploadsHandler {
  constructor(storageService, albumsService, validator){
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postImageHandler = this.postImageHandler.bind(this);
  }

  async postImageHandler(request, h){
    const { cover } = request.payload;
    const { id: albumId } = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    const oldCover = await this._albumsService.selectAlbumCover(albumId);

    const coverUrl = `http://${config.app.host}:${config.app.port}/upload/images/${filename}`;
    await this._albumsService.updateAlbumCover(albumId, coverUrl);

    if (oldCover){
      const split = oldCover.split('/');
      const oldFilename = split[split.length - 1];
      await this._storageService.deleteFile(oldFilename);
    }

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;