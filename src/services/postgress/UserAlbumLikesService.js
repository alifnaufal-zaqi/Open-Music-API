const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');

class UserAlbumLikesService {
  constructor(albumsService, cacheService){
    this._pool = new Pool();
    this._albumsService = albumsService;
    this._cacheService = cacheService;
  }

  async isExistingLike(userId, albumId){
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async insertLike(id, userId, albumId){
    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3)',
      values: [id, userId, albumId]
    };

    await this._albumsService.verifyAlbumExist(albumId);

    const isLike = await this.isExistingLike(userId, albumId);

    if (isLike.length > 0){
      throw new BadRequestError('Anda sudah menyukai album ini');
    }

    await this._pool.query(query);
    await this._cacheService.delete(`likes-album:${albumId}`);
  }

  async deleteLikeByAlbumId(albumId, userId){
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`likes-album:${albumId}`);
  }

  async selectLikeCountByAlbumId(albumId){
    const query = {
      text: 'SELECT COUNT(*) AS album_likes_count FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const { rows } = await this._pool.query(query);

    return parseInt(rows[0].album_likes_count);
  }
}

module.exports = UserAlbumLikesService;