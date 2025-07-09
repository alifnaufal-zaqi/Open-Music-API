const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelSong } = require('../../utils');

class SongsService{
  constructor(){
    this._pool = new Pool();
  }

  async insertSong({ id, title, year, genre, performer, duration, albumId }){
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const { rowCount, rows } = await this._pool.query(query);

    if (!rowCount){
      throw new BadRequestError('Lagu gagal dibuat');
    }

    return rows[0].id;
  }

  async selectSongs(title = null, performer = null){
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE 1 = 1',
      values: [],
    };

    if (title){
      query.text += ` AND title ILIKE $${query.values.length + 1}`;
      query.values.push(`%${title}%`);
    };

    if (performer){
      query.text += ` AND performer ILIKE $${query.values.length + 1}`;
      query.values.push(`%${performer}%`);
    }

    const { rows } = await this._pool.query(query);

    return rows.map(mapDBToModelSong);
  }

  async selectSongsByAlbumId(albumId){
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount){
      return [];
    }

    return rows.map(mapDBToModelSong);
  }

  async selectSongById(id){
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount){
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return rows.map(mapDBToModelSong)[0];
  }

  async verifySongIsExist(songId){
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount){
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async updateSongById(id, { title, year, genre, performer, duration, albumId }){
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount){
      throw new NotFoundError('Lagu gagal diperbarui, Id tidak ditemukan');
    }
  }

  async deleteSongById(id){
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount){
      throw new NotFoundError('Lagu gagal dihapus, Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;