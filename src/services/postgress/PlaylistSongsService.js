const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');

class PlaylistSongsService{
  constructor(songsService){
    this._pool = new Pool();
    this._songsService = songsService;
  }

  async insertSongToPlaylist({ id, playlistId, songId }){
    await this._songsService.verifySongIsExist(songId);

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount){
      throw new BadRequestError('Gagal menambahkan lagu ke playlist');
    }
  }

  async selectSongsOnPlaylist(playlistId){
    const query = {
      text: `SELECT songs.id,
              songs.title,
              songs.performer
              FROM songs JOIN playlist_songs
              ON playlist_songs.song_id = songs.id
              WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async deleteSongFromPlaylist(playlistId, songId){
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    await this._pool.query(query);
  }
}

module.exports = PlaylistSongsService;