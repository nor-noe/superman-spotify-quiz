import type { TrackPreview } from '@/types/spotify'

export const useSpotifyPreviewUpdater = () => {
  const updateMissingPreviews = async (tracks: TrackPreview[]): Promise<TrackPreview[]> => {
    const tracksWithoutPreview = tracks.filter((track) => track.previewUrl === null)

    try {
      const updatedTracks = await $fetch<TrackPreview[]>('/api/spotify/preview', {
        method: 'POST',
        body: { tracks: tracksWithoutPreview },
      })

      const finalTracks = tracks.map((track) => {
        if (track.previewUrl !== null) {
          return track
        }

        const updated = updatedTracks.find((t) => t.id === track.id)
        return updated ?? { ...track, previewUrl: null }
      })

      return finalTracks
    } catch (e) {
      console.error('❌ Failed to update previews', e)
      return tracks
    }
  }

  return {
    updateMissingPreviews,
  }
}
