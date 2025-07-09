const PlaylistsHandler = require('./handler');
const rooutes = require('./routes');

module.exports = {
  name: 'playlist-plugin',
  version: '1.0.0',
  register: async (server, { playlistsService, playlistSongsService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(playlistsService, playlistSongsService, validator);

    server.route(rooutes(playlistsHandler));
  }
};