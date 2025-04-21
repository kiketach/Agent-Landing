import { useAuthStore } from '~/stores/authStore';
import { useCartStore } from '~/stores/cartStore';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Asegurarnos de que el plugin se cargue después de firebase
  const { $firebase } = nuxtApp;

  // Si no hay Firebase, no continuamos con la inicialización
  if (!$firebase) {
    console.error('Plugin Firebase no disponible. Asegúrate de que firebase.client.js se carga primero.');
    return;
  }

  // Inicializar stores
  const authStore = useAuthStore();
  const cartStore = useCartStore();
  
  // Inicializar autenticación
  await authStore.initAuth();
  
  // Si el usuario está autenticado, cargar su carrito
  if (authStore.isLoggedIn) {
    await cartStore.loadCartFromFirestore();
  }
}); 