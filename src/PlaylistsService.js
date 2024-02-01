const { Pool } = require('pg')
const ModelGetSong = require('./utils')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async getPlaylists (playlistId) {
    const query = {
      text: `
      SELECT 
        playlists.id AS "playlist_id",
        playlists.name,
        songs.id,
        title,
        performer
      FROM playlists 
      LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN songs on playlist_songs.song_id = songs.id
      WHERE playlists.id = $1
      `,
      values: [playlistId]
    }
    const result = await this._pool.query(query)

    console.log(result)

    const response = {
      id: result.rows[0].playlist_id,
      name: result.rows[0].name,
      songs: []
    }
    response.songs = result.rows.map(ModelGetSong)

    return response
  }
}

module.exports = PlaylistsService
