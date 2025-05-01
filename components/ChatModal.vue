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
                  <!-- Si el mensaje tiene una imagen -->
                  <img v-if="message.image" :src="message.image" class="message-image" alt="Imagen adjunta" />
                  <!-- Renderizar el texto con enlaces clicables -->
                  <p v-html="formatMessageWithLinks(message.text)"></p>
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                </div>
              </div>
            </div>
            
            <div class="chat-input">
              <div class="input-group">
                <!-- Botón para adjuntar imagen -->
                <label class="btn btn-outline-secondary attach-button" :class="{ 'has-file': selectedFile }">
                  <input type="file" 
                         accept="image/*" 
                         class="d-none" 
                         @change="handleFileSelect" 
                         ref="fileInput">
                  <ClientOnly>
                    <i class="fas fa-paperclip"></i>
                  </ClientOnly>
                </label>
                <input 
                  type="text" 
                  v-model="newMessage" 
                  @keyup.enter="sendMessage" 
                  placeholder="Escribe tu mensaje aquí..." 
                  class="form-control"
                />
                <button 
                  class="btn btn-primary" 
                  @click="sendMessage" 
                  :disabled="!newMessage.trim() && !selectedFile"
                >
                  <ClientOnly>
                    <i class="fas fa-paper-plane"></i>
                  </ClientOnly>
                </button>
              </div>
              <!-- Preview de la imagen seleccionada -->
              <div v-if="selectedFile" class="selected-file-preview">
                <img :src="selectedFilePreview" class="preview-image" alt="Preview" />
                <button class="btn btn-sm btn-danger remove-file" @click="removeSelectedFile">
                  <ClientOnly><i class="fas fa-times"></i></ClientOnly>
                </button>
              </div>
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

// Datos del chat
const messages = ref([]);
const newMessage = ref('');
const chatMessages = ref(null);
const chatModal = ref(null);
const mensajeInicial = ref('');
const sessionId = ref(''); // Nuevo ref para el session_id
const deploymentId = ref('404629075114590208'); // ID de deployment fijo

// Referencias para el manejo de archivos
const fileInput = ref(null);
const selectedFile = ref(null);
const selectedFilePreview = ref('');

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

// Modificar sendToAgent para manejar mejor la imagen
const sendToAgent = async (message, imageData = null) => {
  try {
    console.log('Enviando mensaje al agente:', message);
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://us-central1-[TU-PROYECTO-ID].cloudfunctions.net/agent'
      : '/api/agent';

    // Preparar el mensaje
    const requestBody = {
      user_id: 'test_user',
      session_id: '9058476628769767424',
      message: message
    };

    // Si hay una imagen, incluirla en el cuerpo de la petición
    if (imageData && imageData.startsWith('data:image/')) {
      requestBody.image = imageData;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Estado de la respuesta:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en la respuesta del agente: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al comunicarse con el agente:', error);
    throw error;
  }
};

// Función para manejar la selección de archivos
const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    try {
      // Comprimir la imagen antes de convertirla a base64
      const compressedImage = await compressImage(file);
      selectedFile.value = file;
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedFilePreview.value = e.target.result;
      };
      reader.readAsDataURL(compressedImage);
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      alert('Error al procesar la imagen. Por favor, intenta con otra imagen.');
    }
  }
};

// Función para comprimir la imagen
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calcular nuevas dimensiones manteniendo el aspect ratio
        const maxSize = 800;
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob con calidad reducida
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          } else {
            reject(new Error('Error al comprimir la imagen'));
          }
        }, 'image/jpeg', 0.7); // Calidad 70%
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Función para remover el archivo seleccionado
const removeSelectedFile = () => {
  selectedFile.value = null;
  selectedFilePreview.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Función para convertir enlaces en el texto a elementos <a>
const formatMessageWithLinks = (text) => {
  if (!text) return '';
  // Expresión regular para detectar URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
};

// Modificar la función sendMessage para manejar mejor las imágenes
const sendMessage = async () => {
  if (!newMessage.value.trim() && !selectedFile.value) return;
  
  const messageText = newMessage.value;
  const timestamp = new Date();

  // Si hay una imagen, convertirla a base64
  let imageData = null;
  if (selectedFile.value) {
    imageData = selectedFilePreview.value;
  }

  // Crear el mensaje del usuario
  const userMessage = {
    text: messageText || 'Imagen adjunta',
    sender: 'user',
    timestamp: timestamp,
    image: imageData
  };
  
  // Agregar mensaje del usuario a la lista
  messages.value.push(userMessage);
  
  // Limpiar campos
  newMessage.value = '';
  removeSelectedFile();
  
  // Scroll al final después de añadir mensaje del usuario
  await scrollToBottom();

  try {
    // Enviar mensaje al agente
    const response = await sendToAgent(messageText, imageData);
    
    // Extraer el texto del mensaje del agente
    let messageContent = '';
    
    if (response.message) {
      try {
        // Si el mensaje es una cadena que parece JSON con comillas simples
        if (typeof response.message === 'string' && response.message.includes("'")) {
          // Reemplazar comillas simples por dobles
          const jsonStr = response.message
            .replace(/'/g, '"')
            .replace(/\\n/g, '\\n');
          
          console.log('Procesando JSON:', jsonStr);
          const parsedMessage = JSON.parse(jsonStr);
          
          if (parsedMessage.content?.parts?.[0]?.text) {
            messageContent = parsedMessage.content.parts[0].text;
          }
        } else {
          // Si es un objeto o una cadena simple
          messageContent = typeof response.message === 'object' 
            ? response.message.content?.parts?.[0]?.text || JSON.stringify(response.message)
            : response.message;
        }
      } catch (e) {
        console.error('Error al procesar el mensaje:', e);
        messageContent = response.message;
      }
    }

    // Si no pudimos extraer el mensaje, usar un valor por defecto
    if (!messageContent) {
      messageContent = 'Lo siento, no pude procesar la respuesta correctamente.';
    }
    
    // Agregar respuesta del agente
    const agentMessage = {
      text: messageContent.replace(/\\n/g, '\n'),
      sender: 'admin',
      timestamp: new Date()
    };
    
    messages.value.push(agentMessage);
    await scrollToBottom();

  } catch (error) {
    // En caso de error, mostrar mensaje de error
    const errorMessage = {
      text: error.message || 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
      sender: 'admin',
      timestamp: new Date()
    };
    
    messages.value.push(errorMessage);
    await scrollToBottom();
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

// Función para vaciar el chat
const vaciarChat = () => {
  messages.value = [];
  mensajeInicial.value = '';
  
  // Si hay un usuario autenticado, reinicializar el chat
  const { $firebase } = useNuxtApp();
  const { auth } = $firebase;
  
  if (auth.currentUser) {
    initializeChat();
  }
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

.message-image {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.attach-button {
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.attach-button.has-file {
  background-color: #198754;
  color: white;
  border-color: #198754;
}

.selected-file-preview {
  position: relative;
  margin-top: 8px;
  display: inline-block;
}

.preview-image {
  max-height: 100px;
  border-radius: 8px;
}

.remove-file {
  position: absolute;
  top: -8px;
  right: -8px;
  border-radius: 50%;
  padding: 4px 8px;
}

/* Estilos para los enlaces en los mensajes */
.message-content p a {
  color: #0d6efd;
  text-decoration: underline;
}

.message-content p a:hover {
  color: #0a58ca;
}

.admin-message .message-content p a {
  color: #0d6efd;
}

.user-message .message-content p a {
  color: #0d6efd;
}
</style> 