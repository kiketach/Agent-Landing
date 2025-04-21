  // https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  modules: ['@pinia/nuxt'],
  plugins: [
    '~/plugins/firebase.client.js',
    '~/plugins/bootstrap.client.js',
    '~/plugins/auth.client.js'
  ],
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    }
  },
  app: {
    head: {
      title: 'Hat Trick',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Hat Trick - Tú juego - tú estilo' }
      ],
      link: [
        { rel: 'favicon', type: 'image/png', href: './assets/img/Logo.png' },
        { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v6.3.0/css/all.css' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:400,700' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css' }
      ],
      script: [
        { src: 'https://use.fontawesome.com/releases/v6.3.0/js/all.js', defer: true }
      ]
    }
  }
})
