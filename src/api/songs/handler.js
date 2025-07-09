const { nanoid } = require('nanoid');

class SongsHandler{
  constructor(service, validator){
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  };

  async postSongHandler(request, h){
    this._validator.validatePayload(request.payload);

    const id = `songs-${nanoid(16)}`;
    const { title, year, genre, performer, duration, albumId } = request.payload;

    const songId = await this._service.insertSong({ id, title, year, genre, performer, duration, albumId });

    const response = h.response({
      status: 'success',
      data: {
        songId,
      }
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request){
    const { title, performer } = request.query;
    const songs = await this._service.selectSongs(title, performer);

    return {
      status: 'success',
      data: {
        songs,
      }
    };
  }

  async getSongByIdHandler(request){
    const { id } = request.params;

    const song = await this._service.selectSongById(id);

    return {
      status: 'success',
      data: {
        song,
      }
    };
  }

  async putSongByIdHandler(request){
    this._validator.validatePayload(request.payload);

    const { id } = request.params;
    const { title, year, genre, performer, duration, albumId } = request.payload;

    await this._service.updateSongById(id, { title, year, genre, performer, duration, albumId });

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request){
    const { id } = request.params;

    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;