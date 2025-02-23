const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToModel } = require('../../utils/playlists');

class PlaylistsService{
    constructor(){
        this._pool = new Pool();
    };

    async addPlaylist({ id, name, owner }){
        const query = {
            text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const { rowCount, rows } = await this._pool.query(query);

        if(!rowCount){
            throw new InvariantError('Gagal membuat playlist');
        };

        return rows[0].id;
    };

    async getPlaylistsByOwner(owner){
        const query = {
            text: 'SELECT * FROM playlists WHERE owner = $1',
            values: [owner],
        };

        const { rows } = await this._pool.query(query);

        return rows.map(mapDBToModel);
    };

    async deletePlaylistById(id){
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1',
            values: [id],
        };

        const { rowCount } = await this._pool.query(query);

        if(!rowCount){
            throw new InvariantError('Gagal menghapus playlist');
        };
    };

    async verifyPlaylistOwner(id, owner){
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const { rows, rowCount } = await this._pool.query(query);

        if(!rowCount){
            throw new NotFoundError('Playlist tidak ditemukan');
        };

        const playlist = rows[0];

        if(playlist.owner !== owner){
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini!');
        };
    };
};

module.exports = PlaylistsService;