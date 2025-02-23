const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService{
    constructor(){
        this._pool = new Pool();
    }

    async checkSongFromDB(songId){
        const query = {
            text: 'SELECT id FROM songs WHERE id = $1',
            values: [songId],
        };

        const { rowCount } = await this._pool.query(query);

        if(!rowCount){
            throw new NotFoundError('Lagu tidak ditemukan');
        };
    };

    async addSongToPlaylist({ id, playlistId, songId }){
        const query = {
            text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3)',
            values: [id, playlistId, songId],
        };

        await this.checkSongFromDB(songId);

        const { rowCount } = await this._pool.query(query);

        if(!rowCount){
            throw new InvariantError('Gagal menambahkan lagu ke playlist');
        };
    };

    async getSongsFromPlaylist(playlistId){
        const playlistQuery = {
            text: `SELECT playlists.id, playlists.name, users.username 
                    FROM playlists JOIN users ON playlists.owner = users.id 
                    WHERE playlists.id = $1`,
            values: [playlistId],
        };

        const { rowCount: playlistRowCount, rows: playlistRows } = await this._pool.query(playlistQuery);

        if(!playlistRowCount){
            throw new NotFoundError('Playlist tidak ditemukan');
        };

        const songsQuery = {
            text: `SELECT songs.id, songs.title, songs.performer
                    FROM songs JOIN playlist_songs ON playlist_songs.song_id = songs.id
                    WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId],
        };

        const { rows: songRows } = await this._pool.query(songsQuery);

        return [playlistRows[0], songRows];
    };

    async deleteSongFromPlaylist(playlistId, songId){
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
            values: [playlistId, songId],
        };

        await this._pool.query(query);
    };
};

module.exports = PlaylistSongsService;