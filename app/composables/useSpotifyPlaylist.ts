import type { TrackPreview } from '@/types/spotify'

export const useSpotifyPlaylist = () => {
  const fetchPlaylistTracks = async (playlistId: string): Promise<TrackPreview[]> => {
    try {
      const res = await $fetch<TrackPreview[]>(`/api/spotify/playlist?id=${playlistId}`)
      return res
    } catch (e) {
      console.error('Failed to fetch playlist', e)
      return []
    }
  }

  return {
    fetchPlaylistTracks,
  }
}