const { nanoid } = require("nanoid");

class PlaylistSongsHandler{
    constructor(playlistSongsService, validator, playlistsService){
        this._playlistSongsService = playlistSongsService;
        this._validator = validator;
        this._playlistsService = playlistsService;
    };

    async postSongToPlaylistHandler(request, h){
        this._validator.validatePlaylistSongsPayload(request.payload);
        
        
        const id = `playlistSongs-${nanoid(16)}`;
        const { songId } = request.payload;
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        
        await this._playlistsService.verifyPlaylistOwner(playlistId ,credentialId);
        await this._playlistSongsService.addSongToPlaylist({ id, playlistId, songId });
        

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke playlist',
        });

        response.code(201);
        return response;
    };

    async getSongsFromPlaylistHandler(request){
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        
        const [ playlist, songs ] = await this._playlistSongsService.getSongsFromPlaylist(playlistId);
        return {
            status: 'success',
            data: {
                playlist: {
                    ...playlist,
                    songs,
                },
            },
        };
    };

    async deleteSongFromPlaylistHandler(request){
        this._validator.validatePlaylistSongsPayload(request.payload);

        const { songId } = request.payload;
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        };
    }
};

module.exports = PlaylistSongsHandler;