const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, songs.id AS song_id, songs.title, songs.performer
      FROM playlists
      LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN songs ON songs.id = playlist_songs.song_id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    const result = {
			playlist: {
				id: rows[0].id,
        name: rows[0].name,
        songs: !rows[0].song_id ? [] : rows.map((songData) => ({
          id: songData.song_id,
          title: songData.title,
          performer: songData.performer,
        })),
			}
		};

		return result;
  }
}

module.exports = PlaylistsService;
