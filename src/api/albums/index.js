const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums-plugin',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const { albumsService, songsService } = service;

    const albumHandler = new AlbumsHandler(albumsService, songsService, validator);
    server.route(routes(albumHandler));
  },
};