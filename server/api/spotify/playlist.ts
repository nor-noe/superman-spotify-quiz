import spotifyPreviewFinder from 'spotify-preview-finder'
import type { SpotifyAuthResponse, SpotifyPlaylistTracksResponse, TrackPreview } from '@/types/spotify'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const playlistId = query.id as string | undefined

    if (!playlistId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing playlist ID' })
    }

    // Fetch access token from internal endpoint
    const { access_token } = await $fetch<SpotifyAuthResponse>('/api/spotify/token', {
        method: 'POST',
    })

    // Fetch playlist tracks from Spotify API
    const data = await $fetch<SpotifyPlaylistTracksResponse>(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    })

    console.log('Fetched playlist tracks:', data.items)

    const rawTracks = await Promise.all(
        data.items.map(async (item) => {
            const track = item.track
            if (!track || track.artists[0].name === 'James Gunn') return null

            await sleep(500)
            const result = await spotifyPreviewFinder(track.name, track.artists[0]?.name)
            const previewUrl = result.success && result.results[0]?.previewUrls?.[0] || null

            return {
                id: track.id,
                name: track.name,
                artist: track.artists.map((a) => a.name).join(', '),
                previewUrl,
                image: track.album.images[0]?.url ?? null,
            }
        }) 
    )

    console.log('Fetched tracks:', rawTracks)

    const tracks: TrackPreview[] = rawTracks
        .filter(Boolean)
        .filter((track) => track!.artist !== 'James Gunn') as TrackPreview[]


    return tracks
})
