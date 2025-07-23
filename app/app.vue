<template>
  <div id="app">
    <main>
      <NuxtPage/>
    </main>
    <footer class="footer">
      <div class="footer-content">
        Made by <a href="https://bsky.app/profile/nornoe.bsky.social" target="_blank">nornoe</a>. Not linked with DC Comics or Spotify.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  useHead({
    title: 'Superman Music Quiz',
  })
</script>

<style lang="scss" scoped>

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
}
.footer {
  background-color: #1a1a1a;
  color: white;
  padding: 1rem;
  text-align: center;

  .footer-content {
    font-size: 0.6rem;
    max-width: 800px;
    margin: 0 auto;
  }
  a {
    color: #1e90ff;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
}
</style>
