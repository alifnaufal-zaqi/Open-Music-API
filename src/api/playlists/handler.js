const { nanoid } = require('nanoid');

class PlaylistsHandler{
  constructor(playlistsService, playlistSongsService, validator){
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsByOwnerHandler = this.getPlaylistsByOwnerHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.addSongToPlaylistHandler = this.addSongToPlaylistHandler.bind(this);
    this.getSongsInPlaylist = this.getSongsInPlaylist.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h){
    this._validator.validatePlaylistPayload(request.payload);

    const id = `playlist-${nanoid(16)}`;
    const { id: owner } = request.auth.credentials;
    const { name } = request.payload;

    const playlistId = await this._playlistsService.insertPlaylist({ id, name, owner });

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);

    return response;
  }

  async getPlaylistsByOwnerHandler(request){
    const { id: owner } = request.auth.credentials;
    const playlists = await this._playlistsService.selectPlaylistByOwner(owner);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request){
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._playlistsService.deletePlaylist(playlistId);

    return {
      status: 'success',
      message: 'Berhasil menghapus playlist',
    };
  }

  async addSongToPlaylistHandler(request, h){
    this._validator.validatePlaylistSongPayload(request.payload);

    const id = `playlist_songs-${nanoid(16)}`;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._playlistSongsService.insertSongToPlaylist({ id, playlistId, songId });

    const response  = h.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu ke playlist',
    });
    response.code(201);

    return response;
  }

  async getSongsInPlaylist(request){
    const { id: owner } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    const playlist = await this._playlistsService.selectPlaylistById(playlistId);
    const songs = await this._playlistSongsService.selectSongsOnPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        }
      }
    };
  }

  async deleteSongFromPlaylistHandler(request){
    this._validator.validatePlaylistSongPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: 'Berhasil menghapus lagu dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;