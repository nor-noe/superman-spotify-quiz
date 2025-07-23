export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const credentials = btoa(`${config.spotifyClientId}:${config.spotifyClientSecret}`)

  const res = await $fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  return res
})
