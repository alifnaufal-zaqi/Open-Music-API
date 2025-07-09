const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'export-plugin',
  version: '1.0.0',
  register: async (server, { producerServices, playlistsServices, validator }) => {
    const exportsHandler = new ExportsHandler(producerServices, playlistsServices, validator);
    server.route(routes(exportsHandler));
  }
};