<template>
  <div class="modal fade" id="chatModal" tabindex="-1" aria-labelledby="chatModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="chatModalLabel">
            <ClientOnly><i class="fas fa-comments me-2"></i></ClientOnly> Habla con nosotros
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="chat-container">
            <div class="chat-messages" ref="chatMessages">
              <div v-for="(message, index) in messages" :key="index" 
                   :class="['message', message.sender === 'user' ? 'user-message' : 'admin-message']">
                <div class="message-content">
                  <p>{{ message.text }}</p>
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                </div>
              </div>
            </div>
            
            <div class="chat-input">
              <input 
                type="text" 
                v-model="newMessage" 
                @keyup.enter="sendMessage" 
                placeholder="Escribe tu mensaje aquí..." 
              />
              <button 
                class="btn btn-primary" 
                @click="sendMessage" 
                :disabled="!newMessage.trim()"
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
import { ref, onMounted, nextTick, watch } from 'vue';
import { useNuxtApp } from '#app';

// Datos del chat
const messages = ref([]);
const newMessage = ref('');
const chatMessages = ref(null);

// Referencia al modal
const chatModal = ref(null);

// Lógica de inicialización del chat (anteriormente parte de startChat)
const initializeChat = async () => {
  const { $firebase } = useNuxtApp();
  const { auth, db } = $firebase;
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.warn("Usuario no autenticado al iniciar el chat.");
    // Podrías añadir un mensaje indicando que se necesita iniciar sesión
    messages.value.push({
      text: 'Por favor, inicia sesión para usar el chat.',
      sender: 'admin',
      timestamp: new Date()
    });
    return; // Salir si no hay usuario
  }
  
  const userName = currentUser.displayName || 'Usuario'; // Usar nombre de Firebase o un genérico

  // Mensaje inicial
  messages.value.push({
    text: `Hola ${userName}, ¿en qué podemos ayudarte?`,
    sender: 'admin',
    timestamp: new Date()
  });
  
  // Guardar información inicial del chat en Firebase
  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const chatRef = doc(db, "chats", currentUser.uid);
      
    // Considera si realmente necesitas guardar los mensajes aquí o solo al enviar el primero
    await setDoc(chatRef, {
      userName: userName, // Guardar nombre de usuario de Firebase
      userEmail: currentUser.email, // Guardar email de Firebase
      messages: messages.value, // Guardar mensaje inicial
      startedAt: serverTimestamp(), // Usar serverTimestamp para consistencia
      userId: currentUser.uid
    }, { merge: true }); // Usar merge: true por si el chat ya existía
  } catch (error) {
    console.error("Error al guardar información inicial del chat:", error);
  }

  // Asegurarse de hacer scroll después de añadir el mensaje inicial
  await scrollToBottom();
};

// Enviar mensaje
const sendMessage = async () => {
  if (!newMessage.value.trim()) return;
  
  const messageText = newMessage.value;
  const timestamp = new Date(); // Usar la misma timestamp para UI y DB

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

  // Guardar mensaje del usuario en Firebase
  try {
    const { $firebase } = useNuxtApp();
    const { auth, db } = $firebase;
    
    if (auth.currentUser) {
      const { doc, updateDoc, arrayUnion } = await import('firebase/firestore');
      const chatRef = doc(db, "chats", auth.currentUser.uid);
      
      // Usar el objeto userMessage creado antes
      await updateDoc(chatRef, {
        messages: arrayUnion(userMessage) 
      });

      // Simular respuesta automática después de un breve retraso y guardar en Firebase
      setTimeout(async () => {
        const adminMessage = {
          text: 'Gracias por contactarnos. Un asesor responderá a tu mensaje pronto. También puedes contactarnos directamente por WhatsApp al 312 5141329.',
          sender: 'admin',
          timestamp: new Date() // Nueva timestamp para la respuesta
        };
        messages.value.push(adminMessage);

        // Guardar respuesta automática en Firebase
        try {
          await updateDoc(chatRef, {
             messages: arrayUnion(adminMessage)
          });
        } catch (error) {
           console.error("Error al guardar respuesta automática:", error);
        }

        // Hacer scroll al final después de la respuesta automática
        await scrollToBottom();
      }, 1000);

    }
  } catch (error) {
    console.error("Error al guardar mensaje del usuario:", error);
  }
};

// Formatear hora del mensaje
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  // Asegurarse que es un objeto Date, convertir si es Timestamp de Firebase
  const date = timestamp instanceof Date ? timestamp : (timestamp?.toDate ? timestamp.toDate() : new Date());
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
}, { deep: true }); // Usar deep watch si los objetos dentro del array pueden cambiar

onMounted(async () => {
  // Inicializar modal con Bootstrap
  try {
    const { $bootstrap } = useNuxtApp();
    if ($bootstrap && $bootstrap.Modal) {
      const modalEl = document.getElementById('chatModal');
      if (modalEl) {
        chatModal.value = new $bootstrap.Modal(modalEl);
        
        // Escuchar evento 'shown.bs.modal' para inicializar el chat cuando se muestra el modal
        modalEl.addEventListener('shown.bs.modal', async () => {
          // Verificar si el chat ya fue inicializado para evitar múltiples inicializaciones
          if (messages.value.length === 0) { 
             await initializeChat();
          }
        });
      }
    } else if (typeof window !== 'undefined' && window.bootstrap) {
      const modalEl = document.getElementById('chatModal');
      if (modalEl) {
        chatModal.value = new window.bootstrap.Modal(modalEl);
         modalEl.addEventListener('shown.bs.modal', async () => {
          if (messages.value.length === 0) {
             await initializeChat();
          }
        });
      }
    }
  } catch (error) {
    console.error('Error al inicializar el modal de chat:', error);
  }

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
.chat-input input:focus {
  border-color: #86b7fe; /* Cambiar color de borde al enfocar */
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