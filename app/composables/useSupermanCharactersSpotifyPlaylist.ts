import type { CharacterTrack } from '@/types/spotify'
import characterPlaylist from '@/assets/data/character-playlists.json'

export const useSupermanCharactersSpotifyPlaylist = () => {
  const fetchAllTracks = async (totalCount?: number): Promise<CharacterTrack[]> => {
    const allTracks: CharacterTrack[] = []
    const characters = characterPlaylist as {
      character: string
      id: string
      trackList: Omit<CharacterTrack, 'character'>[]
    }[]

    for (const { character, trackList } of characters) {
      const shuffled = [...trackList].sort(() => Math.random() - 0.5)
      const selected = totalCount
        ? shuffled.slice(0, Math.floor(totalCount / characters.length))
        : shuffled

      for (const track of selected) {
        allTracks.push({ ...track, character })
      }
    }

    return allTracks.sort(() => Math.random() - 0.5)
  }

  return {
    fetchAllTracks,
  }
}
