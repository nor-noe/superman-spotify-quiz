// server/api/spotify/preview/track.ts
import spotifyPreviewFinder from 'spotify-preview-finder'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { trackName, artist } = body

  if (!trackName) {
    return {
      success: false,
      error: 'Missing trackName in request body.',
    }
  }

  try {
    const result = await spotifyPreviewFinder(trackName, artist ?? undefined)
    const previewUrl = result.success ? result.results[0]?.previewUrls?.[0] ?? null : null

    return {
      success: true,
      trackName,
      artist: artist ?? null,
      previewUrl,
    }
  } catch (e) {
    console.error('❌ Error fetching preview for', trackName, artist, e)
    return {
      success: false,
      error: 'Failed to fetch preview.',
    }
  }
})
