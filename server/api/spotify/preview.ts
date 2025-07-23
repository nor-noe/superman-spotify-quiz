import spotifyPreviewFinder from 'spotify-preview-finder'
import type { TrackPreview } from '@/types/spotify'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default defineEventHandler(async (event) => {
  const body = await readBody<{ tracks: TrackPreview[] }>(event)
  const updatedTracks: TrackPreview[] = []

  for (const track of body.tracks) {
    if (track.previewUrl !== null) {
      updatedTracks.push(track)
      continue
    }

    await sleep(500)

    try {
      const result = await spotifyPreviewFinder(track.name, track.artist)
      const previewUrl = result.success && result.results[0]?.previewUrls?.[0] || null

      updatedTracks.push({
        ...track,
        previewUrl,
      })
    } catch (e) {
      console.error(`❌ Error finding preview for ${track.name} — ${track.artist}`, e)
      updatedTracks.push({
        ...track,
        previewUrl: null,
      })
    }
  }

  return updatedTracks
})
