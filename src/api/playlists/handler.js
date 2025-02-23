const { nanoid } = require("nanoid");

class PlaylistsHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;
    };

    async postPlaylistHandler(request, h){
        this._validator.validatePlaylistPayload(request.payload);

        const id = `playlist-${nanoid(16)}`;
        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        const playlistId = await this._service.addPlaylist({ id, name, owner: credentialId });

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil dibuat',
            data: {
                playlistId,
            },
        });

        response.code(201);
        return response;
    };

    async getPlaylistsHandler(request){
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getPlaylistsByOwner(credentialId);

        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    };

    async deletePlaylistHandler(request){
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._service.deletePlaylistById(id);

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        };
    };
};

module.exports = PlaylistsHandler;