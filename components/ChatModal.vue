<template>
  <div class="modal fade" id="chatModal" tabindex="-1" aria-labelledby="chatModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="chatModalLabel">
            <i class="fas fa-comments me-2"></i> Habla con nosotros
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
                :disabled="!isFormCompleted"
              />
              <button 
                class="btn btn-primary" 
                @click="sendMessage" 
                :disabled="!newMessage.trim() || !isFormCompleted"
              >
                <ClientOnly>
                  <i class="fas fa-paper-plane"></i>
                </ClientOnly>
              </button>
            </div>
          </div>
          
          <!-- Formulario inicial -->
          <div v-if="!isFormCompleted" class="chat-form">
            <h6 class="mb-3">Por favor, completa tus datos para comenzar el chat:</h6>
            <div class="mb-3">
              <label for="chatName" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="chatName" v-model="userData.name" placeholder="Tu nombre">
            </div>
            <div class="mb-3">
              <label for="chatEmail" class="form-label">Correo electrónico</label>
              <input type="email" class="form-control" id="chatEmail" v-model="userData.email" placeholder="correo@ejemplo.com">
            </div>
            <div class="mb-3">
              <label for="chatPhone" class="form-label">Teléfono</label>
              <input type="tel" class="form-control" id="chatPhone" v-model="userData.phone" placeholder="Tu número de teléfono">
            </div>
            <button class="btn btn-primary w-100" @click="startChat" :disabled="!isFormValid">
              Iniciar Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useNuxtApp } from '#app';

// Datos del chat
const messages = ref([]);
const newMessage = ref('');
const chatMessages = ref(null);
const isFormCompleted = ref(false);

// Datos del usuario
const userData = ref({
  name: '',
  email: '',
  phone: ''
});

// Validar formulario
const isFormValid = computed(() => {
  return userData.value.name.trim() !== '' && 
         userData.value.email.trim() !== '' && 
         userData.value.phone.trim() !== '';
});

// Referencia al modal
const chatModal = ref(null);

// Iniciar chat
const startChat = async () => {
  if (!isFormValid.value) return;
  
  isFormCompleted.value = true;
  
  // Mensaje inicial
  messages.value.push({
    text: `Hola ${userData.value.name}, ¿en qué podemos ayudarte?`,
    sender: 'admin',
    timestamp: new Date()
  });
  
  // Guardar información en Firebase si el usuario está autenticado
  try {
    const { $firebase } = useNuxtApp();
    const { auth, db } = $firebase;
    
    if (auth.currentUser) {
      const { doc, setDoc } = await import('firebase/firestore');
      const chatRef = doc(db, "chats", auth.currentUser.uid);
      
      await setDoc(chatRef, {
        userData: userData.value,
        messages: messages.value,
        startedAt: new Date(),
        userId: auth.currentUser.uid
      });
    }
  } catch (error) {
    console.error("Error al guardar información del chat:", error);
  }
};

// Enviar mensaje
const sendMessage = async () => {
  if (!newMessage.value.trim() || !isFormCompleted.value) return;
  
  const messageText = newMessage.value;
  
  // Agregar mensaje a la lista
  messages.value.push({
    text: messageText,
    sender: 'user',
    timestamp: new Date()
  });
  
  // Limpiar campo de mensaje
  newMessage.value = '';
  
  // Simular respuesta automática después de un breve retraso
  setTimeout(() => {
    messages.value.push({
      text: 'Gracias por contactarnos. Un asesor responderá a tu mensaje pronto. También puedes contactarnos directamente por WhatsApp al +573146187857.',
      sender: 'admin',
      timestamp: new Date()
    });
    
    // Hacer scroll al final
    scrollToBottom();
  }, 1000);
  
  // Guardar mensajes en Firebase si el usuario está autenticado
  try {
    const { $firebase } = useNuxtApp();
    const { auth, db } = $firebase;
    
    if (auth.currentUser) {
      const { doc, updateDoc, arrayUnion } = await import('firebase/firestore');
      const chatRef = doc(db, "chats", auth.currentUser.uid);
      
      await updateDoc(chatRef, {
        messages: arrayUnion({
          text: messageText,
          sender: 'user',
          timestamp: new Date()
        })
      });
    }
  } catch (error) {
    console.error("Error al guardar mensajes:", error);
  }
};

// Formatear hora del mensaje
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
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
});

onMounted(() => {
  // Inicializar modal con Bootstrap
  try {
    // Intentar usar bootstrap desde la instancia Nuxt
    const { $bootstrap } = useNuxtApp();
    if ($bootstrap && $bootstrap.Modal) {
      const modalEl = document.getElementById('chatModal');
      if (modalEl) {
        chatModal.value = new $bootstrap.Modal(modalEl);
      }
    }
    // Si no está disponible, intentar usar window.bootstrap
    else if (typeof window !== 'undefined' && window.bootstrap) {
      const modalEl = document.getElementById('chatModal');
      if (modalEl) {
        chatModal.value = new window.bootstrap.Modal(modalEl);
      }
    }
  } catch (error) {
    console.error('Error al inicializar el modal de chat:', error);
  }
  
  // Cargar información del usuario si está autenticado
  const { $firebase } = useNuxtApp();
  const { auth } = $firebase;
  
  if (auth.currentUser) {
    userData.value.name = auth.currentUser.displayName || '';
    userData.value.email = auth.currentUser.email || '';
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 400px;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message {
  max-width: 75%;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
}

.user-message {
  align-self: flex-end;
  background-color: #dcf8c6;
}

.admin-message {
  align-self: flex-start;
  background-color: #f1f0f0;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-content p {
  margin-bottom: 0.25rem;
}

.message-time {
  font-size: 0.75rem;
  color: #888;
  align-self: flex-end;
}

.chat-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.chat-input input {
  flex-grow: 1;
  border: 1px solid #ced4da;
  border-radius: 1.5rem;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
}

.chat-input button {
  border-radius: 50%;
  padding: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-form {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}
</style> 