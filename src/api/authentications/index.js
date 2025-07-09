/* eslint-disable linebreak-style */
const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications-plugin',
  version: '1.0.0',
  register: async (server, { authenticationsService, usersService, tokenManager, validator }) => {
    const authenticationsHandler = new AuthenticationsHandler(authenticationsService, usersService, tokenManager, validator);

    server.route(routes(authenticationsHandler));
  }
};