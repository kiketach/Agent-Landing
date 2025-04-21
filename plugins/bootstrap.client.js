import * as bootstrap from 'bootstrap'

export default defineNuxtPlugin(nuxtApp => {
  // Hacer que bootstrap esté disponible en la aplicación
  nuxtApp.provide('bootstrap', bootstrap)
  
  // Hacer que bootstrap esté disponible globalmente
  if (typeof window !== 'undefined') {
    window.bootstrap = bootstrap
  }
}) 