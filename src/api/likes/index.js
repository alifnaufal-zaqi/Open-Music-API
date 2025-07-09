const LikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes-plugin',
  version: '1.0.0',
  register: async (server, { service, cacheService }) => {
    const likesHandler = new LikesHandler(service, cacheService);
    server.route(routes(likesHandler));
  }
};