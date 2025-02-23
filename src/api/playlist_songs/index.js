const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'playlist_songs',
    version: '1.0.0',
    register: async (server, { playlistSongsService, validator, playlistsService }) => {
        const playlistSongsHandler = new PlaylistSongsHandler(playlistSongsService, validator, playlistsService);
        server.route(routes(playlistSongsHandler));
    },
};