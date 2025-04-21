<template>
  <div>
    <NavBar />
    <main>
      <slot />
    </main>
    <FooterComponent />
    <!-- Añadir modales globales -->
    <LoginModal />
    <CartModal />
    <ChatModal />
  </div>
</template>

<script setup>
// Importar explícitamente los componentes
import NavBar from '~/components/NavBar.vue';
import FooterComponent from '~/components/FooterComponent.vue';
import LoginModal from '~/components/LoginModal.vue';
import CartModal from '~/components/CartModal.vue';
import ChatModal from '~/components/ChatModal.vue';
</script>

<style scoped>
/* Añadir padding superior al contenido principal para compensar el navbar fijo */
main {
  padding-top: 4.5rem; /* Ajuste inicial para móvil */
}

@media (min-width: 992px) {
  main {
    padding-top: 6rem; /* Ajuste para escritorio (navbar más alto inicialmente) */
  }
}
</style> 