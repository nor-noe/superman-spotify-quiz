import type { CharacterTrack } from '@/types/spotify'
import { computed } from 'vue'

export const useCountVotes = (
  likedSongs: Ref<CharacterTrack[]>,
  dislikedSongs: Ref<CharacterTrack[]>,
  neutralSongs: Ref<CharacterTrack[]>
) => {
  const characterScores = computed(() => {
    const scores: Record<string, number> = {}

    // +2 for likes
    for (const track of likedSongs.value) {
      scores[track.character] = (scores[track.character] || 0) + 2
    }

    // +1 for neutral votes
    for (const track of neutralSongs.value) {
      scores[track.character] = (scores[track.character] || 0) + 1
    }

    // -2 for dislikes
    for (const track of dislikedSongs.value) {
      scores[track.character] = (scores[track.character] || 0) - 2
    }

    return scores
  })

  const topCharacter = computed(() => {
    const entries = Object.entries(characterScores.value)
    if (entries.length === 0) return null

    return entries.reduce((max, current) => (current[1] > max[1] ? current : max))[0]
  })

  return {
    characterScores,
    topCharacter,
  }
}
