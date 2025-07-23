<script lang="ts" setup>
import type { CharacterTrack } from '@/types/spotify';
import { useMediaControls } from '@vueuse/core';

const props = defineProps<{
    song: CharacterTrack;
}>();

const audioRef = ref()

const {
  playing: isPlaying,
  waiting,
  ended
} = useMediaControls(audioRef, {
  src: props.song.previewUrl!,
})

const canPlay = computed(() => audioRef.value && !waiting.value)

const togglePlay = () => {
  if (!canPlay.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}

watch(ended, (hasEnded) => {
  if (hasEnded) {
    audioRef.value.currentTime = 0
  }
})
</script>   

<template>
    <div class="song-sheet">
        <audio 
            ref="audioRef" 
            :src="song.previewUrl!" 
            preload="metadata"
        />
        <div class="img-container">
            <img :src="song.image" :alt="song.name">
        </div>
        <div class="song-content">
            <div class="song-infos">
                <div class="song-name">
                    <ScrollingTitle :title="song.name" />
                </div>
                <div class="song-artist">
                    <ScrollingTitle :title="song.artist" />
                </div>
            </div>
            <div class="song-play-btn">
                <button :disabled="!canPlay" @click="togglePlay">
                    <Icon v-if="isPlaying" name="mdi:pause" />
                    <Icon v-else name="mdi:play" />
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.song-sheet {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    background: white;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    .img-container {
        width: 250px;
        height: 250px;
        align-self: center;
        margin-bottom: 3rem;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 5px;
        }
    }

    .song-content {
        display: flex;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: center;
    }

    .song-infos {
        .song-name {
            font-weight: bold;
            font-size: 1.2rem;
            color: black;
        }

        .song-artist {
            color: #666;
            font-size: 0.9rem;
        }
    }

    .song-play-btn {
        height: 100%;

        button {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgb(241, 241, 241);
            color: black;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1.5rem;

            &:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
        }
    }
}
</style>