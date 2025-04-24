<template>
  <div class="modal fade" id="chatModal" tabindex="-1" aria-labelledby="chatModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <div class="d-flex justify-content-between align-items-center w-100">
            <h5 class="modal-title mb-0" id="chatModalLabel">
              <ClientOnly><i class="fas fa-comments me-2"></i></ClientOnly> Habla con nosotros
            </h5>
            <div class="d-flex align-items-center gap-3">
              <button type="button" class="btn btn-outline-light" @click="vaciarChat">
                <ClientOnly><i class="fas fa-trash me-2"></i></ClientOnly> Vaciar chat
              </button>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <div class="chat-container">
            <div v-if="mensajeInicial" class="message customer-message">
              {{ mensajeInicial }}
            </div>
            <div class="chat-messages" ref="chatMessages">
              <div v-for="(message, index) in messages" :key="index" 
                   :class="['message', message.sender === 'user' ? 'user-message' : 'admin-message']">
                <div class="message-content">
                  <p>{{ message.text }}</p>
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                </div>
              </div>
            </div>
            
            <div class="chat-input" :class="{ 'loading': isLoading }">
              <input 
                type="text" 
                v-model="newMessage" 
                @keyup.enter="sendMessage" 
                placeholder="Escribe tu mensaje aquí..." 
                :disabled="isLoading"
              />
              <button 
                class="btn btn-primary" 
                @click="sendMessage" 
                :disabled="!newMessage.trim() || isLoading"
              >
                <ClientOnly>
                  <i class="fas fa-paper-plane"></i>
                </ClientOnly>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onBeforeUnmount } from 'vue';
import { useNuxtApp } from '#app';
import vertexAgent from '~/services/vertexAgent';

// Datos del chat
const messages = ref([]);
const newMessage = ref('');
const chatMessages = ref(null);
const chatModal = ref(null);
const mensajeInicial = ref('');
const isLoading = ref(false);

// Información de la sesión con Vertex AI
const sessionInfo = ref({
  projectId: 'grounded-tine-454414-b2',
  location: 'us-central1',
  resourceId: '404629075114590208',
  userId: 'anonymous_user',
  sessionId: '9058476628769767424' // Sesión por defecto para usuarios anónimos
});

// Lógica de inicialización del chat
const initializeChat = async () => {
  try {
    // Generar un ID de usuario único para esta sesión si no hay uno autenticado
    const userId = generateUserId();
    sessionInfo.value.userId = userId;
    
    console.log('Inicializando chat con sesión:', sessionInfo.value);
    
    // Mensaje inicial
    messages.value.push({
      text: `Hola, ¿en qué podemos ayudarte?`,
      sender: 'admin',
      timestamp: new Date()
    });
    
    // Scroll al fondo
    await scrollToBottom();
  } catch (error) {
    console.error("Error al inicializar chat:", error);
    // Mensaje de error
    messages.value.push({
      text: "Lo sentimos, ha ocurrido un error al inicializar el chat. Por favor, inténtalo de nuevo más tarde.",
      sender: 'admin',
      timestamp: new Date()
    });
  }
};

// Generar ID de usuario aleatorio para sesiones anónimas
const generateUserId = () => {
  return 'anonymous_' + Math.random().toString(36).substring(2, 15);
};

// Enviar mensaje
const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return;
  
  const messageText = newMessage.value;
  const timestamp = new Date();

  const userMessage = {
    text: messageText,
    sender: 'user',
    timestamp: timestamp
  };
  
  // Agregar mensaje del usuario a la lista
  messages.value.push(userMessage);
  
  // Limpiar campo de mensaje
  newMessage.value = '';
  
  // Scroll al final después de añadir mensaje del usuario
  await scrollToBottom();
  
  // Indicar que estamos cargando
  isLoading.value = true;
  
  try {
    // Enviar mensaje al agente Vertex AI
    const agentResponse = await vertexAgent.sendMessage(messageText, sessionInfo.value);
    
    // Crear mensaje de respuesta del agente
    const adminMessage = {
      text: agentResponse,
      sender: 'admin',
      timestamp: new Date()
    };
    
    // Agregar respuesta a la lista de mensajes
    messages.value.push(adminMessage);
  } catch (error) {
    console.error("Error al procesar mensaje:", error);
    
    // Mensaje de error en caso de fallo
    messages.value.push({
      text: "Lo sentimos, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde.",
      sender: 'admin',
      timestamp: new Date()
    });
  } finally {
    // Finalizar carga
    isLoading.value = false;
    
    // Scroll al final
    await scrollToBottom();
  }
};

// Formatear hora del mensaje
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  // Asegurarse que es un objeto Date
  const date = timestamp instanceof Date ? timestamp : new Date();
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};

// Hacer scroll al final de los mensajes
const scrollToBottom = async () => {
  await nextTick();
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

// Observar cambios en los mensajes para hacer scroll
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

// Función para vaciar el chat
const vaciarChat = () => {
  messages.value = [];
  mensajeInicial.value = '';
  
  // Reinicializar el chat
  initializeChat();
};

onMounted(() => {
  const modalElement = document.getElementById('chatModal');
  if (modalElement) {
    chatModal.value = new bootstrap.Modal(modalElement);
    
    // Escuchar el evento abrir-chat
    window.addEventListener('abrir-chat', (event) => {
      if (event.detail) {
        mensajeInicial.value = event.detail;
      }
      chatModal.value.show();
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('abrir-chat', () => {});
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 400px; /* O ajusta según sea necesario */
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: #ffffff; /* Fondo claro para mensajes */
}

.message {
  max-width: 75%;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  word-wrap: break-word; /* Para que el texto largo no rompa el layout */
}

.user-message {
  align-self: flex-end;
  background-color: #dcf8c6; /* Verde claro típico de WhatsApp */
  color: #000; /* Texto oscuro para contraste */
}

.admin-message {
  align-self: flex-start;
  background-color: #e5e5ea; /* Gris claro típico de iMessage */
  color: #000; /* Texto oscuro para contraste */
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-content p {
  margin-bottom: 0.25rem;
  line-height: 1.4; /* Mejorar legibilidad */
}

.message-time {
  font-size: 0.75rem;
  color: #6c757d; /* Gris más oscuro para mejor visibilidad */
  align-self: flex-end;
  margin-top: 0.25rem; /* Pequeño espacio sobre la hora */
}

.chat-input {
  display: flex;
  align-items: center; /* Centrar verticalmente input y botón */
  padding: 0.75rem 1rem; /* Ajustar padding */
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa; /* Fondo ligeramente gris */
  position: relative;
}

.chat-input input {
  flex-grow: 1;
  border: 1px solid #ced4da;
  border-radius: 1.5rem; /* Bordes redondeados */
  padding: 0.6rem 1.2rem; /* Más padding interno */
  margin-right: 0.75rem; /* Más espacio antes del botón */
  font-size: 0.95rem; /* Tamaño de fuente ligeramente mayor */
  outline: none; /* Quitar borde al enfocar */
  box-shadow: none; /* Quitar sombra al enfocar */
}

/* Indicador de carga para cuando el agente está procesando */
.chat-input::after {
  content: "";
  display: block;
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, transparent, #0d6efd, transparent);
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.3s;
}

.chat-input.loading::after {
  opacity: 1;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.chat-input button {
  border-radius: 50%;
  padding: 0; /* Quitar padding extra si se usan dimensiones fijas */
  width: 2.8rem; /* Tamaño del botón un poco más grande */
  height: 2.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* Evitar que el botón se encoja */
  transition: background-color 0.2s ease; /* Transición suave */
}
.chat-input button:hover:not(:disabled) {
  background-color: #0b5ed7; /* Oscurecer un poco en hover */
}
.chat-input button:disabled {
  opacity: 0.65; /* Opacidad estándar para deshabilitado */
  cursor: not-allowed;
}
.chat-input button i {
  font-size: 1.1rem; /* Icono un poco más grande */
}

/* Estilo del formulario eliminado */
/* 
.chat-form {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
} 
*/

/* Mejoras generales al modal */
.modal-content {
  border-radius: 0.75rem; /* Bordes más redondeados */
  overflow: hidden; /* Para asegurar que el contenido respete los bordes */
}
.modal-header {
  background-color: #0d6efd; /* Azul primario de Bootstrap */
  color: white;
  border-bottom: none; /* Quitar borde inferior */
  padding: 1rem 1.5rem; /* Más padding */
}
.modal-header .btn-close {
  filter: invert(1) grayscale(100%) brightness(200%); /* Botón de cierre blanco */
}
.modal-title {
  font-weight: 500; /* Peso de fuente medio */
}
.modal-body {
  padding: 0; /* Quitar padding del body para controlar el padding en .chat-container */
}
</style> 