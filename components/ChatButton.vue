<template>
  <button 
    class="chat-float-button" 
    @click="openChatModal"
    title="¿Necesitas ayuda?"
  >
    <ClientOnly>
      <i class="fas fa-headset"></i>
    </ClientOnly>
  </button>
</template>

<script setup>
import { useNuxtApp } from '#app';

const openChatModal = () => {
  window.dispatchEvent(new CustomEvent('abrir-chat'));
};
</script>

<style scoped>
.chat-float-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1050;
}

.chat-float-button i {
  font-size: 24px;
}

.chat-float-button:hover {
  transform: scale(1.1);
  background-color: #0b5ed7;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.chat-float-button:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .chat-float-button {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }
  
  .chat-float-button i {
    font-size: 20px;
  }
}
</style> 