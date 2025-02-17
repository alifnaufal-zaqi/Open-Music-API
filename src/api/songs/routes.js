const routes = (handler) => [
  {
    method: "POST",
    path: "/songs",
    handler: (request, h) => handler.postSongHandler(request, h),
  },
  {
    method: "GET",
    path: "/songs",
    handler: (request) => handler.getSongsHandler(request),
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: (request) => handler.getSongByIdHandler(request),
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: (request) => handler.putSongHandler(request),
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: (request) => handler.deleteSongById(request),
  },
];

module.exports = routes;
