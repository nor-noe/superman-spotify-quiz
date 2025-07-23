declare module 'spotify-preview-finder' {
  export interface SpotifyPreviewResult {
    success: boolean
    searchQuery: string
    error?: string
    results: Array<{
      name: string
      spotifyUrl: string
      previewUrls: string[]
      trackId: string
      albumName: string
      releaseDate: string
      popularity: number
      durationMs: number
    }>
  }

  const spotifyPreviewFinder: (
    songName: string,
    artistName?: string,
    limit?: number
  ) => Promise<SpotifyPreviewResult>

  export default spotifyPreviewFinder
}
