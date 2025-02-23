const routes = (handler) => [
    {
        method: 'POST',
        path: '/users',
        handler: (request, h) => handler.postUserHandler(request, h),
    },
    {
        method: 'GET',
        path: '/users',
        handler: (request) => handler.getUserhandler(request),
    },
];

module.exports = routes;