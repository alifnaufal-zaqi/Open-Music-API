const { nanoid } = require('nanoid');

class AlbumsHandler{
  constructor(albumService, songService, validator){
    this._albumService = albumService;
    this._songService = songService;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h){
    this._validator.validatePayload(request.payload);

    const id = `album-${nanoid(16)}`;
    const { name, year } = request.payload;

    const albumId = await this._albumService.insertAlbum({ id, name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      }
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request){
    const { id } = request.params;

    const album = await this._albumService.selectAlbumById(id);
    const coverUrl = await this._albumService.selectAlbumCover(id);
    const songs = await this._songService.selectSongsByAlbumId(id);

    return {
      status: 'success',
      data: {
        album: {
          ...album,
          coverUrl,
          songs,
        },
      }
    };
  }

  async putAlbumByIdHandler(request){
    this._validator.validatePayload(request.payload);

    const { id } = request.params;
    const { name, year } = request.payload;

    await this._albumService.updateAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request){
    const { id } = request.params;

    await this._albumService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil di hapus',
    };
  }
}

module.exports = AlbumsHandler;