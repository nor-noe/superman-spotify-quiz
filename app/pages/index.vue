<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import type { CharacterTrack } from '@/types/spotify'
import characterPlaylist from '@/assets/data/character-playlists.json'

const STORAGE_KEY = 'superman-quiz-state'

const dislikedSongs = ref<CharacterTrack[]>([])
const likedSongs = ref<CharacterTrack[]>([])
const neutralSongs = ref<CharacterTrack[]>([])
const songs = ref<CharacterTrack[]>([])
const currentSongIndex = ref(0)
const quizStarted = ref(false)
const quizEnded = ref(false)

const { fetchAllTracks } = useSupermanCharactersSpotifyPlaylist()
const { topCharacter } = useCountVotes(likedSongs, dislikedSongs, neutralSongs)

const topCharacterImage = computed(() => {
  if (!topCharacter.value) return ''
  return characterPlaylist.find(c => c.character === topCharacter.value)?.image || ''
})

const topCharacterPlaylist = computed(() => {
  if (!topCharacter.value) return ''
  const characterData = characterPlaylist.find(c => c.character === topCharacter.value)
  return `https://open.spotify.com/playlist/${characterData?.id}`
})

// Load state from localStorage
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
        const state = JSON.parse(saved)
        likedSongs.value = state.likedSongs || []
        dislikedSongs.value = state.dislikedSongs || []
        neutralSongs.value = state.neutralSongs || []
        currentSongIndex.value = state.currentSongIndex || 0
        songs.value = state.songs || []
        quizStarted.value = state.quizStarted || false
        quizEnded.value = state.quizEnded || false
    } catch (e) {
        console.warn('Failed to load quiz state:', e)
        localStorage.removeItem(STORAGE_KEY)
    }
  }
})

// Save state to localStorage on vote
function saveQuizState() {
  const state = {
    likedSongs: likedSongs.value,
    dislikedSongs: dislikedSongs.value,
    neutralSongs: neutralSongs.value,
    currentSongIndex: currentSongIndex.value,
    songs: songs.value,
    quizStarted: quizStarted.value,
    quizEnded: quizEnded.value,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

async function startQuiz(quick: boolean) {
  if (quick) {
    songs.value = await fetchAllTracks(33)
  } else {
    songs.value = await fetchAllTracks()
  }

    likedSongs.value = []
    dislikedSongs.value = []
    neutralSongs.value = []
    currentSongIndex.value = 0
    quizStarted.value = true
    quizEnded.value = false
    saveQuizState()
}

function handleVote(vote: 'yes' | 'no' | 'neutral') {
  const currentSong = songs.value[currentSongIndex.value]
  if (!currentSong) return

  if (vote === 'yes') {
    likedSongs.value.push(currentSong)
  } else if (vote === 'no') {
    dislikedSongs.value.push(currentSong)
  } else if (vote === 'neutral') {
    neutralSongs.value.push(currentSong)
  }

  currentSongIndex.value++

  if (currentSongIndex.value >= songs.value.length) {
    quizEnded.value = true
  }

  saveQuizState()
}

function restart() {
    localStorage.removeItem(STORAGE_KEY)
    likedSongs.value = []
    dislikedSongs.value = []
    neutralSongs.value = []
    songs.value = []
    currentSongIndex.value = 0
    quizEnded.value = false
    quizStarted.value = false
}
</script>

<template>
  <div id="index">
    <div v-if="!quizStarted" class="home">
      <h1>Which Superman character are you?</h1>
      <h2>Based on your music taste</h2>
      <div class="ctas">
        <button @click="startQuiz(true)">
          Quick Quiz
        </button>
        <button @click="startQuiz(false)">
          Full Quiz
        </button>
      </div>
    </div>

    <div v-else-if="songs.length > 0 && !quizEnded" class="quiz">
      <div class="quiz-progress">
        <span>Song {{ currentSongIndex + 1 }} of {{ songs.length }}</span>
      </div>
      <div class="song-sheet-container">
        <SongSheet :song="songs[currentSongIndex]!" />
      </div>
      <h1>Is this the type of song you listen to?</h1>
      <div class="quiz-actions">
        <button class="btn-no" @click="handleVote('no')">
          <Icon name="mdi:thumb-down" />
        </button>
        <button class="btn-neutral" @click="handleVote('neutral')">
          <Icon name="mdi:emoticon-neutral" />
        </button>
        <button class="btn-yes" @click="handleVote('yes')">
          <Icon name="mdi:thumb-up" />
        </button>
      </div>
    </div>

    <div v-else-if="quizEnded" class="result">
      <div v-if="topCharacter" class="quiz-results">
        <div class="quiz-results-title">You are</div>
        <img class="top-character-image" :src="topCharacterImage" :alt="topCharacter">
        <a class="button" :href="topCharacterPlaylist" target="_blank">Check out their playlist</a>
      </div>
      <div class="ctas">
        <button @click="restart()">
          Restart Quiz
        </button>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
#index {
    padding: 2rem 1rem 5rem 1rem;
    display: flex;
    flex-grow: 1;

    .home {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        h1 {
            text-align: center;
            font-size: 3rem;
            margin: 0;
            text-shadow: 1px 1px 2px black;

            @media (max-width: 700px) {
                font-size: 2.5rem;
            }
        }

        h2 {
            text-align: center;
            font-size: 1.5rem;
            margin: 0.5rem 0 2rem 0;
            text-shadow: 1px 1px 2px black;

            @media (max-width: 700px) {
                margin: 1rem 0 2rem 0;
            }
        }

        .ctas {
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            gap: 1rem;
        }

        button {
            background-color: #307ca7;
            border: 1px solid #1a5f7c;
            width: 100%;
            max-width: 300px;
            padding: 0.5rem 1rem;
            display: inline-flex;
            overflow: hidden;
            margin: 0 7px 1vh;
            color: #FFFFFF;
            vertical-align: middle;
            border-radius: 4px;
            cursor: pointer;
            justify-content: center;
            font-size: 1.2rem;
        }
    }

    .quiz {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .quiz-progress {
            background: white;
            margin-bottom: 1rem;
            color: black;
            font-weight: bold;
            width: 296px;
            padding: 0.5rem;
            text-align: center;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        h1 {
            text-shadow: 1px 1px 2px black;
            margin: 1rem 0;
            text-align: center;
            font-size: 1.25rem;
        }

        .quiz-actions {
            display: flex;
            gap: 1.5rem;

            button {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                box-shadow: 0 0 15px #000000;

                &.btn-yes {
                    background-color: #29d780;
                    color: white;

                    &:hover {
                        background-color: #20c070;
                    }
                }

                &.btn-no {
                    background-color: #e74c3c;
                    color: white;

                    &:hover {
                        background-color: #c0392b;
                    }
                }

                &.btn-neutral {
                    background-color: darkgray;
                    color: white;

                    &:hover {
                        background-color: gray;
                    }
                }
            }
        }
    }

    .result {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: auto;

        .ctas {
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            gap: 1rem;
        }

        button {
            background-color: #307ca7;
            border: 1px solid #1a5f7c;
            width: 100%;
            max-width: 300px;
            padding: 0.5rem 1rem;
            display: inline-flex;
            overflow: hidden;
            margin: 0 7px 1vh;
            color: #FFFFFF;
            vertical-align: middle;
            border-radius: 4px;
            cursor: pointer;
            justify-content: center;
            font-size: 1.2rem;
        }
    }

    .quiz-results {
        background: white;
        align-self: center;
        margin: auto;
        padding: 1rem;
        color: black;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;

        .quiz-results-title {
            font-size: 2rem;
            font-weight: bold;
        }

        .button {
            margin-top: 0.5rem;
            background-color: rgb(32, 32, 32);
            width: 100%;
            max-width: 300px;
            padding: 0.5rem 1rem;
            display: inline-flex;
            overflow: hidden;
            margin: 0 7px 1vh;
            color: #FFFFFF;
            vertical-align: middle;
            border-radius: 4px;
            cursor: pointer;
            justify-content: center;
            font-size: 1rem;
            text-decoration: none;
        }
    }

}

</style>
