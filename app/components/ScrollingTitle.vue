<template>
  <div class="scrolling-title-container" :class="{ 'scrolling': shouldScroll }">
    <div 
      ref="titleRef" 
      class="scrolling-title"
      :class="{ 'animate': shouldScroll }"
    >
      {{ title }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: '200px'
})

const titleRef = ref<HTMLElement>()
const shouldScroll = ref(false)

onMounted(() => {
  nextTick(() => {
    checkIfShouldScroll()
  })
})

watch(() => props.title, () => {
  nextTick(() => {
    checkIfShouldScroll()
  })
})

const checkIfShouldScroll = () => {
  if (titleRef.value) {
    const container = titleRef.value.parentElement
    if (container) {
      shouldScroll.value = titleRef.value.scrollWidth > container.clientWidth
    }
  }
}
</script>

<style scoped>
.scrolling-title-container {
  width: v-bind(maxWidth);
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}

.scrolling-title {
  display: inline-block;
  white-space: nowrap;
}

.scrolling-title.animate {
  animation: scroll-text 8s linear infinite;
}

@keyframes scroll-text {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(0);
    }

    75% {
        transform: translateX(calc(-100% + v-bind(maxWidth)));
    }

    100% {
        transform: translateX(calc(-100% + v-bind(maxWidth)));
    }
}

/* Pause l'animation au hover pour améliorer l'UX */
.scrolling-title-container:hover .scrolling-title.animate {
  animation-play-state: paused;
}
</style>