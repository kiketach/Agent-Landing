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
                  :disabled="!(newMessage && newMessage.trim()) && !selectedFile"
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
import { ref, onMounted, nextTick, watch, onBeforeUnmount, shallowRef } from 'vue';
import { useNuxtApp } from '#app';

// Datos del chat
const messages = ref([]);
const newMessage = ref('');
const chatMessages = ref(null);
const chatModal = ref(null); // Referencia al objeto Modal de Bootstrap
const selectedFile = ref(null);
const selectedFilePreview = ref('');
const fileInput = ref(null);
const mensajeInicial = ref(''); // Para mensaje pre-cargado al abrir modal

const currentSessionId = ref(null);
const currentUserId = ref(null);

// Firebase instances - will be initialized on client-side
const auth = shallowRef(null);
const db = shallowRef(null);

const initializeChat = async () => {
  if (!auth.value) {
    console.warn("initializeChat called before Firebase auth is initialized.");
    if (!messages.value.some(m => m.text.includes("El chat se está inicializando"))) {
        messages.value.push({
          text: 'El chat se está inicializando, por favor espera...',
          sender: 'admin',
          timestamp: new Date()
        });
    }
    return;
  }

  const currentUser = auth.value.currentUser;

  if (!currentUser) {
    console.warn("Usuario no autenticado al iniciar el chat.");
    if (!messages.value.some(m => m.text.includes("inicia sesión para usar el chat"))) {
        messages.value.push({
          text: 'Por favor, inicia sesión para usar el chat.',
          sender: 'admin',
          timestamp: new Date()
        });
    }
    return;
  }

  currentUserId.value = currentUser.uid;
  const userName = currentUser.displayName || 'Usuario';

  // Limpiar mensajes anteriores si es una reinicialización y añadir el de bienvenida
  if (messages.value.length === 0 || messages.value.every(m => m.sender !== 'admin' || !m.text.startsWith('Hola'))) {
      messages.value.push({
        text: `Hola ${userName}, ¿en qué podemos ayudarte?`,
        sender: 'admin',
        timestamp: new Date()
      });
  }


  await createOrGetSession();

  try {
    if (!db.value) {
      console.error("Firestore (db) is not initialized in initializeChat.");
      return;
    }
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const chatRef = doc(db.value, "chats", currentUser.uid);

    await setDoc(chatRef, {
      userName: userName,
      userEmail: currentUser.email,
      messages: messages.value.filter(m => m.sender === 'admin' && m.text.startsWith('Hola')) // Solo el mensaje de bienvenida inicial
                           .map(m => ({ ...m, text: m.text, sender: m.sender, timestamp: m.timestamp.toISOString() })),
      startedAt: serverTimestamp(),
      userId: currentUser.uid
    }, { merge: true });
  } catch (error) {
    console.error("Error al guardar información inicial del chat:", error);
  }

  await scrollToBottom();
};

const createOrGetSession = async () => {
  if (currentSessionId.value) return;

  if (!currentUserId.value) {
    if (!auth.value || !auth.value.currentUser) {
        console.warn("createOrGetSession: auth not ready or no current user for currentUserId check.");
        if (!messages.value.some(m => m.text.includes("Debes iniciar sesión"))) {
             messages.value.push({ text: "Error: Debes iniciar sesión para crear una sesión de chat.", sender: 'admin', timestamp: new Date() });
        }
        return;
    }
    currentUserId.value = auth.value.currentUser.uid;
  }
  
  if (!currentUserId.value) { // Doble chequeo por si acaso
      console.error("No se puede crear sesión: Usuario no autenticado (ID nulo).");
      if (!messages.value.some(m => m.text.includes("Debes iniciar sesión"))) {
           messages.value.push({ text: "Error: Debes iniciar sesión para crear una sesión de chat.", sender: 'admin', timestamp: new Date() });
      }
      return;
  }


  try {
    console.log("Vue: Solicitando nueva sesión de chat para user_id:", currentUserId.value);
    const response = await fetch('/api/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: currentUserId.value })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear sesión: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    if (data.session_id) {
      currentSessionId.value = data.session_id;
      console.log('Vue: Sesión creada/obtenida:', currentSessionId.value);
    } else {
      throw new Error('ID de sesión no devuelto por el servidor.');
    }
  } catch (error) {
    console.error('Vue: Error al crear u obtener sesión:', error);
    if (!messages.value.some(m => m.text.includes("Error al iniciar la sesión"))) {
        messages.value.push({ text: 'Error al iniciar la sesión de chat. Por favor, intenta recargar.', sender: 'admin', timestamp: new Date() });
    }
  }
};

const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    try {
      const compressedImage = await compressImage(file);
      selectedFile.value = file; // Podrías guardar el archivo comprimido aquí si lo necesitas
      
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedFilePreview.value = e.target.result;
      };
      reader.readAsDataURL(compressedImage); // Usar el archivo comprimido para la preview
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      alert('Error al procesar la imagen. Por favor, intenta con otra imagen.');
    }
  }
};

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
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
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          } else {
            reject(new Error('Error al comprimir la imagen'));
          }
        }, 'image/jpeg', 0.7);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const removeSelectedFile = () => {
  selectedFile.value = null;
  selectedFilePreview.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatMessageWithLinks = (text) => {
  if (!text) return '';
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
};

const sendMessage = async () => {
  if (!(newMessage.value && newMessage.value.trim()) && !selectedFile.value) return;

  if (!currentUserId.value) {
    console.error("Vue: Usuario no identificado. No se puede enviar mensaje.");
    messages.value.push({ text: "Error: Usuario no identificado. Por favor, recarga.", sender: 'admin', timestamp: new Date() });
    return;
  }

  if (!currentSessionId.value) {
    await createOrGetSession();
    if (!currentSessionId.value) {
      console.error("Vue: ID de sesión no establecido. No se puede enviar mensaje.");
      messages.value.push({ text: "Error: No se pudo establecer la sesión de chat. Por favor, recarga.", sender: 'admin', timestamp: new Date() });
      return;
    }
  }
  
  const messageText = newMessage.value;
  const timestamp = new Date();
  let imageData = null;
  if (selectedFile.value) {
    imageData = selectedFilePreview.value; // Usar la preview base64
  }

  const userMessage = {
    text: messageText || (imageData ? 'Imagen adjunta' : ''),
    sender: 'user',
    timestamp: timestamp,
    image: imageData
  };
  
  messages.value.push(userMessage);
  newMessage.value = '';
  removeSelectedFile();
  await scrollToBottom();

  try {
    const requestBodyToApiAgent = {
      user_id: currentUserId.value,
      session_id: currentSessionId.value,
      message: messageText,
      // image: imageData, // Descomentar si el backend está listo para imágenes
    };

    const response = await fetch('/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(requestBodyToApiAgent)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error del servicio del agente: ${response.status} ${errorText}`);
    }

    if (!response.body) {
        throw new Error("No hay cuerpo de respuesta del servicio del agente.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let currentAgentMessageText = '';
    let agentMessageRef = null;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      let boundary = buffer.indexOf('\n\n');

      while (boundary !== -1) {
        const chunk = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 2);
        
        if (chunk.startsWith('data: ')) {
          const jsonData = chunk.substring(6);
          try {
            const eventData = JSON.parse(jsonData);
            console.log('Vue: Datos del evento SSE:', eventData);

            let partText = '';
            if (eventData.message?.content?.parts?.[0]?.text) {
              partText = eventData.message.content.parts[0].text;
            } else if (eventData.type === "error" && eventData.message) {
              partText = `Error del agente: ${eventData.message}`;
            } else if (eventData.type === "unknown_event" && eventData.data_str) {
              console.log("Vue: Intentando parsear data_str de unknown_event:", eventData.data_str);
              try {
                // Reemplazar comillas simples de Python por dobles para que sea JSON válido
                const jsonCompatibleStr = eventData.data_str.replace(/'/g, '"');
                const parsedDataStr = JSON.parse(jsonCompatibleStr);
                if (parsedDataStr.content?.parts?.[0]?.text) {
                  partText = parsedDataStr.content.parts[0].text;
                }
              } catch (parseError) {
                console.error("Vue: Error al parsear data_str de unknown_event:", parseError, "String original:", eventData.data_str);
                partText = `Evento no reconocido (sin parsear): ${eventData.data_str.substring(0, 100)}...`; // Mostrar un fragmento
              }
            }

            if (partText) {
              currentAgentMessageText += partText;
              if (!agentMessageRef) {
                const newAgentMessage = {
                  text: currentAgentMessageText.replace(/\\n/g, '\n'),
                  sender: 'admin',
                  timestamp: new Date(),
                };
                messages.value.push(newAgentMessage);
                agentMessageRef = messages.value[messages.value.length - 1];
              } else {
                agentMessageRef.text = currentAgentMessageText.replace(/\\n/g, '\n');
              }
              await scrollToBottom();
            }
          } catch (e) {
            console.error('Vue: Error al parsear datos JSON de SSE:', e, "Datos:", jsonData);
          }
        }
        boundary = buffer.indexOf('\n\n');
      }
    }
  } catch (error) {
    console.error("Vue: Error al enviar mensaje o procesar stream:", error);
    const errorMessage = {
      text: `Error: ${error.message || 'No se pudo comunicar con el agente. Intenta nuevamente.'}`,
      sender: 'admin',
      timestamp: new Date()
    };
    messages.value.push(errorMessage);
    await scrollToBottom();
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp?.toDate ? timestamp.toDate() : timestamp);
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

watch(messages, scrollToBottom, { deep: true });

const vaciarChat = async () => {
  messages.value = [];
  mensajeInicial.value = '';
  currentSessionId.value = null;
  
  if (auth.value && auth.value.currentUser) {
    await initializeChat();
  } else {
    if (!messages.value.some(m => m.text.includes("inicia sesión para usar el chat"))) {
        messages.value.push({
          text: 'Por favor, inicia sesión para usar el chat.',
          sender: 'admin',
          timestamp: new Date()
        });
    }
  }
};

let abrirChatListener = null;
let shownModalListener = null; // Para poder removerlo

onMounted(() => {
  const nuxtApp = useNuxtApp();
  if (nuxtApp.$firebase && nuxtApp.$firebase.auth && nuxtApp.$firebase.db) {
    auth.value = nuxtApp.$firebase.auth;
    db.value = nuxtApp.$firebase.db;
    console.log("ChatModal: Firebase auth and db initialized on client mount.");
    currentUserId.value = auth.value.currentUser ? auth.value.currentUser.uid : null;
  } else {
    console.error("ChatModal: $firebase or its properties (auth, db) not available on client mount. Check Firebase plugin.");
    if (!messages.value.some(m => m.text.includes("Error al cargar el chat"))) {
        messages.value.push({
          text: 'Error al cargar el chat. Por favor, intenta recargar la página.',
          sender: 'admin',
          timestamp: new Date()
        });
    }
    return;
  }

  const modalElement = document.getElementById('chatModal');
  if (modalElement) {
    // Importar Bootstrap dinámicamente en el cliente
    import('bootstrap/js/dist/modal').then(module => {
      const BootstrapModal = module.default;
      chatModal.value = new BootstrapModal(modalElement); // Guardar la instancia
    });

    shownModalListener = async () => {
      if (!auth.value) {
        console.warn("shown.bs.modal: auth.value not ready.");
        if (!messages.value.some(m => m.text.includes("El chat aún se está cargando"))) {
             messages.value.push({ text: 'El chat aún se está cargando...', sender: 'admin', timestamp: new Date() });
        }
        return;
      }

      if (auth.value.currentUser && (!messages.value.length || messages.value.every(m => m.sender !== 'admin' || !m.text.startsWith('Hola')))) {
        await initializeChat();
      } else if (!auth.value.currentUser && !messages.value.length) {
         if (!messages.value.some(m => m.text.includes("inicia sesión para usar el chat"))) {
            messages.value.push({
                text: 'Por favor, inicia sesión para usar el chat.',
                sender: 'admin',
                timestamp: new Date()
            });
         }
      }
      scrollToBottom();
    };
    modalElement.addEventListener('shown.bs.modal', shownModalListener);

    abrirChatListener = async (event) => {
      if (event.detail) {
        mensajeInicial.value = event.detail;
      }
      if (auth.value) {
        currentUserId.value = auth.value.currentUser ? auth.value.currentUser.uid : null;
      }

      if (currentUserId.value && !currentSessionId.value && auth.value) {
          await createOrGetSession();
      }
      if (chatModal.value && typeof chatModal.value.show === 'function') {
        chatModal.value.show();
      } else {
        // Fallback si la instancia de Bootstrap no está lista (poco probable si se importa arriba)
        const bsModal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        bsModal.show();
      }
    };
    window.addEventListener('abrir-chat', abrirChatListener);
  }
});

onBeforeUnmount(() => {
  if (abrirChatListener) {
    window.removeEventListener('abrir-chat', abrirChatListener);
  }
  const modalElement = document.getElementById('chatModal');
  if (modalElement && shownModalListener) {
    modalElement.removeEventListener('shown.bs.modal', shownModalListener);
  }
  if (chatModal.value && typeof chatModal.value.dispose === 'function') {
    chatModal.value.dispose(); // Limpiar la instancia del modal de Bootstrap
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
  /* align-items: center; Centrar verticalmente input y botón */
  flex-direction: column; /* Para que la preview esté debajo */
  padding: 0.75rem 1rem; /* Ajustar padding */
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa; /* Fondo ligeramente gris */
}

.chat-input .input-group { /* Estilo para el grupo de input y botones */
  display: flex;
  align-items: center;
  width: 100%;
}


.chat-input input.form-control { /* Específico para el input de texto */
  flex-grow: 1;
  border: 1px solid #ced4da;
  border-radius: 1.5rem; /* Bordes redondeados */
  padding: 0.6rem 1.2rem; /* Más padding interno */
  /* margin-right: 0.75rem; Espacio manejado por gap en input-group */
  font-size: 0.95rem; /* Tamaño de fuente ligeramente mayor */
  outline: none; /* Quitar borde al enfocar */
  box-shadow: none; /* Quitar sombra al enfocar */
}
.chat-input input.form-control:focus {
  border-color: #86b7fe; /* Cambiar color de borde al enfocar */
}

.chat-input button.btn { /* Estilo para los botones de enviar y adjuntar */
  border-radius: 50%;
  padding: 0;
  width: 2.8rem;
  height: 2.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s ease;
}
.chat-input button.btn:hover:not(:disabled) {
  background-color: #0b5ed7; /* Oscurecer un poco en hover para el primario */
}
.chat-input button.btn.btn-outline-secondary:hover:not(:disabled) {
  background-color: #5a6268; /* Un gris más oscuro para el secundario */
  color: white;
}

.chat-input button.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.chat-input button.btn i {
  font-size: 1.1rem;
}

/* Mejoras generales al modal */
.modal-content {
  border-radius: 0.75rem;
  overflow: hidden;
}
.modal-header {
  background-color: #0d6efd;
  color: white;
  border-bottom: none;
  padding: 1rem 1.5rem;
}
.modal-header .btn-close {
  filter: invert(1) grayscale(100%) brightness(200%);
}
.modal-title {
  font-weight: 500;
}
.modal-body {
  padding: 0;
}

.message-image {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
}

.input-group { /* Ya definido arriba, pero para asegurar que tenga gap */
  gap: 8px;
}

.attach-button { /* Ya es un .btn, así que hereda estilos */
  cursor: pointer;
}

.attach-button.has-file {
  background-color: #198754;
  color: white;
  border-color: #198754;
}
.attach-button.has-file:hover {
  background-color: #157347;
}


.selected-file-preview {
  position: relative;
  margin-top: 8px;
  display: inline-block; /* Para que no ocupe todo el ancho */
  align-self: flex-start; /* Alinear a la izquierda debajo del input */
  max-width: 50%; /* Limitar el ancho de la preview */
}

.preview-image {
  max-height: 100px;
  max-width: 100%; /* Para que se ajuste al contenedor .selected-file-preview */
  border-radius: 8px;
  display: block; /* Para evitar espacio extra debajo */
}

.remove-file {
  position: absolute;
  top: -10px; /* Ajustar para que esté un poco más arriba */
  right: -10px; /* Ajustar para que esté un poco más a la derecha */
  border-radius: 50%;
  padding: 0;
  width: 24px; /* Tamaño fijo */
  height: 24px; /* Tamaño fijo */
  font-size: 0.8rem; /* Tamaño del icono */
  line-height: 1; /* Para centrar el icono si es texto */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Estilos para los enlaces en los mensajes */
.message-content p a {
  color: #0d6efd;
  text-decoration: underline;
}

.message-content p a:hover {
  color: #0a58ca;
}

/* No es necesario diferenciar el color del enlace por tipo de mensaje si se quiere consistencia */
/*
.admin-message .message-content p a {
  color: #0d6efd;
}

.user-message .message-content p a {
  color: #0d6efd;
}
*/
</style>
