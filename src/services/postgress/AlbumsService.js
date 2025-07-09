const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(){
    this._pool = new Pool();
  }

  async insertAlbum({ id, name, year }){
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount){
      throw new BadRequestError('Album gagal di buat');
    }

    return rows[0].id;
  }

  async selectAlbumById(id){
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount){
      throw new NotFoundError('Album tidak ditemukan');
    }

    return rows[0];
  }

  async updateAlbumById(id, { name, year }){
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Album gagal diperbarui, Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id){
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount){
      throw new NotFoundError('Album gagal dihapus, Id tidak ditemukan');
    }
  }

  async verifyAlbumExist(albumId){
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount){
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async selectAlbumCover(albumId){
    const query = {
      text: 'SELECT cover FROM albums WHERE id = $1',
      values: [albumId],
    };

    const { rowCount, rows } = await this._pool.query(query);

    if (!rowCount){
      throw new NotFoundError('Cover tidak ditemukan');
    }

    return rows[0].cover;
  }

  async updateAlbumCover(albumId, coverUrl){
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2',
      values: [coverUrl, albumId],
    };

    await this._pool.query(query);
  }
}

module.exports = AlbumsService;