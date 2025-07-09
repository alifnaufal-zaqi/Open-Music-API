const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuhtorizationError');

class PlaylistsService{
  constructor(){
    this._pool = new Pool();
  }

  async insertPlaylist({ id, name, owner }){
    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount){
      throw new BadRequestError('Playlistt gagal dibuat');
    }

    return rows[0].id;
  }

  async selectPlaylistByOwner(owner){
    const query = {
      text: `SELECT playlists.id,
            playlists.name,
            users.username
            FROM playlists JOIN users ON playlists.owner = users.id
            WHERE owner = $1`,
      values: [owner],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async selectPlaylistById(playlistId){
    const query = {
      text: `SELECT playlists.id,
              playlists.name,
              users.username
              FROM playlists JOIN users
              ON playlists.owner = users.id
              WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const { rowCount, rows } = await this._pool.query(query);

    if (!rowCount){
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return rows[0];
  }

  async deletePlaylist(playlistId){
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount){
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(playlistId, owner){
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const { rowCount, rows } = await this._pool.query(query);

    if (!rowCount){
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = rows[0];

    if (playlist.owner !== owner){
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistsService;