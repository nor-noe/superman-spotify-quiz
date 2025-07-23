// types/spotify.ts

export interface SpotifyAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface SpotifyPlaylistTracksResponse {
  items: Array<{
    track: {
      id: string
      name: string
      preview_url: string | null
      artists: Array<{ name: string }>
      album: {
        images: Array<{ url: string }>
      }
    } | null
  }>
}

export interface CharacterPlaylist {
  character: string
  id: string
  trackList: TrackPreview[]
}

export interface CharacterTrack {
  id: string
  name: string
  artist: string
  previewUrl: string | null
  image: string
  character: string
}

export interface TrackPreview {
  id: string
  name: string
  artist: string
  previewUrl: string | null
  image: string | null
}
