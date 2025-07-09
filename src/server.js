require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');

// Albums
const AlbumsService = require('./services/postgress/AlbumsService');
const AlbumValidator = require('./validator/albums');
const albums = require('./api/albums');

// Songs
const SongsService = require('./services/postgress/SongsServie');
const SongValidator = require('./validator/songs');
const songs = require('./api/songs');

// Users
const UsersService = require('./services/postgress/UsersService');
const UsersValidator = require('./validator/users');
const users = require('./api/users');

// Authentications
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsService = require('./services/postgress/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');
const authentications = require('./api/authentications');

// Playlists
const PlaylistsService = require('./services/postgress/PlaylistsService');
const PlaylistSongsService = require('./services/postgress/PlaylistSongsService');
const PlaylistsValidator = require('./validator/playlists');
const playlists = require('./api/playlists');

// Export
const ProducerServices = require('./services/rabbitmq/ProducerServices');
const ExportsValidator = require('./validator/exports');
const _export = require('./api/exports');

// Uploads
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');
const uploads = require('./api/uploads');

// Likes
const UserAlbumLikesService = require('./services/postgress/UserAlbumLikesService');
const likes = require('./api/likes');

// Cache
const CacheService = require('./services/redis/CacheService');

const ClientError = require('./exceptions/ClientError');

const initServer = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const playlistSongsService = new PlaylistSongsService(songsService);
  const cacheService = new CacheService();
  const userAlbumLikesService = new UserAlbumLikesService(albumsService, cacheService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      }
    }
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    }
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: {
          albumsService,
          songsService,
        },
        validator: AlbumValidator,
      }
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      }
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        playlistSongsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: _export,
      options: {
        producerServices: ProducerServices,
        playlistsServices: playlistsService,
        validator: ExportsValidator,
      }
    },
    {
      plugin: uploads,
      options: {
        storageService,
        albumsService,
        validator: UploadsValidator,
      }
    },
    {
      plugin: likes,
      options: {
        service: userAlbumLikesService,
        cacheService,
      }
    }
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError){
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });

      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running in ${server.info.uri}`);
};

initServer();
