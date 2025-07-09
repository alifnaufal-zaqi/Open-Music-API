const { nanoid } = require('nanoid');

class LikesHandler {
  // service = UserAlbumLikesService;
  constructor(service, cacheService){
    this._service = service;
    this._cacheService = cacheService;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    this.getLikesByAlbumIdHandler = this.getLikesByAlbumIdHandler.bind(this);
  }

  async postLikeHandler(request, h){
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    const id = `likes-${nanoid(16)}`;

    await this._service.insertLike(id, userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });

    response.code(201);
    return response;
  }

  async deleteLikeHandler(request){
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.deleteLikeByAlbumId(albumId, userId);

    return {
      status: 'success',
      message: 'Berhasil batal menyukai allbum',
    };
  }

  async getLikesByAlbumIdHandler(request, h){
    const { id: albumId } = request.params;

    try {
      const likes = await this._cacheService.get(`likes-album:${albumId}`);

      const respose = h.response({
        status: 'success',
        data: {
          likes: parseInt(likes),
        }
      });
      respose.header('X-Data-Source', 'cache');
      return respose;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      const likes = await this._service.selectLikeCountByAlbumId(albumId);

      await this._cacheService.set(`likes-album:${albumId}`, likes, 1800);

      return {
        status: 'success',
        data: {
          likes,
        }
      };
    }
  }
}

module.exports = LikesHandler;