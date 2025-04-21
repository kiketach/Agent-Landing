<template>
  <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">Iniciar Sesión</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <!-- Botón de Google -->
          <button 
            class="btn btn-outline-danger w-100 mb-4 d-flex align-items-center justify-content-center gap-3 py-3" 
            @click="loginWithGoogle"
          >
            <i class="bi bi-google fs-4"></i>
            <span class="fs-5">Continuar con Google</span>
          </button>
          
          <!-- Botón de Facebook -->
          <button 
            class="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-center gap-3 py-3" 
            @click="loginWithFacebook"
          >
            <i class="bi bi-facebook fs-4"></i>
            <span class="fs-5">Continuar con Facebook</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modal de Alerta -->
  <div class="modal fade" id="alertModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="alertTitle">Alerta</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center py-4">
          <i class="fas fa-exclamation-circle fa-3x text-dark mb-3"></i>
          <p id="alertMessage" class="mb-0">{{ alertMessage }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Aceptar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/authStore';
import { useCartStore } from '~/stores/cartStore';
import { useNuxtApp } from '#app';

// Acceder a las stores y plugins
const authStore = useAuthStore();
const cartStore = useCartStore();
const { $bootstrap } = useNuxtApp();

// Referencias a los modales
const loginModal = ref(null);
const alertModal = ref(null);

// Estado para alertas
const alertMessage = ref('');
const alertTitle = ref('Alerta');

// Estado para el formulario de inicio de sesión
const email = ref('');
const password = ref('');

// Estado para el formulario de registro
const registerName = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const confirmPassword = ref('');

// Estado para controlar si se muestra el formulario de inicio de sesión o registro
const isRegistering = ref(false);

// Función para iniciar sesión
const login = async () => {
  if (!email.value || !password.value) {
    alert('Por favor, completa todos los campos');
    return;
  }
  
  try {
    await authStore.login(email.value, password.value);
    
    // Cargar carrito después de iniciar sesión
    await cartStore.loadCartFromFirestore();
    
    // Cerrar modal después de iniciar sesión exitosamente
    if (loginModal.value) {
      loginModal.value.hide();
    }
    
    // Limpiar formulario
    email.value = '';
    password.value = '';
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Error al iniciar sesión: ' + error.message);
  }
};

// Función para registrar un nuevo usuario
const register = async () => {
  if (!registerName.value || !registerEmail.value || !registerPassword.value || !confirmPassword.value) {
    alert('Por favor, completa todos los campos');
    return;
  }
  
  if (registerPassword.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden');
    return;
  }
  
  try {
    await authStore.register(registerName.value, registerEmail.value, registerPassword.value);
    
    // Cerrar modal después de registrarse exitosamente
    if (loginModal.value) {
      loginModal.value.hide();
    }
    
    // Limpiar formulario
    registerName.value = '';
    registerEmail.value = '';
    registerPassword.value = '';
    confirmPassword.value = '';
    isRegistering.value = false;
  } catch (error) {
    console.error('Error al registrarse:', error);
    alert('Error al registrarse: ' + error.message);
  }
};

// Funciones para iniciar sesión con proveedores
const loginWithGoogle = async () => {
  try {
    await authStore.loginWithGoogle();
    
    // Cargar carrito después de iniciar sesión
    await cartStore.loadCartFromFirestore();
    
    // Cerrar modal después de iniciar sesión exitosamente
    if (loginModal.value) {
      loginModal.value.hide();
    }
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    
    // Determinar mensaje de error apropiado
    let errorMessage = 'Hubo un error al iniciar sesión. Por favor, intenta nuevamente.';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'La ventana de inicio de sesión fue cerrada antes de completar el proceso.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'El navegador bloqueó la ventana emergente. Por favor, permita ventanas emergentes para este sitio.';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'Ya existe una cuenta con este email usando otro método de inicio de sesión.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      return; // No mostrar error si el usuario canceló
    }
    
    // Mostrar alerta
    alertMessage.value = errorMessage;
    alertTitle.value = 'Error de Autenticación';
    
    if (alertModal.value) {
      alertModal.value.show();
    }
  }
};

const loginWithFacebook = async () => {
  try {
    await authStore.loginWithFacebook();
    
    // Cargar carrito después de iniciar sesión
    await cartStore.loadCartFromFirestore();
    
    // Cerrar modal después de iniciar sesión exitosamente
    if (loginModal.value) {
      loginModal.value.hide();
    }
  } catch (error) {
    console.error('Error al iniciar sesión con Facebook:', error);
    
    // Determinar mensaje de error apropiado
    let errorMessage = 'Hubo un error al iniciar sesión. Por favor, intenta nuevamente.';
    let errorTitle = 'Error de Autenticación';
    
    if (error.message.includes('conexión segura')) {
      errorTitle = 'Error con Facebook';
      errorMessage = 'Facebook requiere una conexión segura (HTTPS) para el inicio de sesión.<br><br>' +
        'Por favor:<br>' +
        '1. Utiliza Google para iniciar sesión localmente, o<br>' +
        '2. Accede a la versión en línea con HTTPS de la aplicación.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'La ventana de inicio de sesión fue cerrada antes de completar el proceso.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'El navegador bloqueó la ventana emergente. Por favor, permita ventanas emergentes para este sitio.';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'Ya existe una cuenta con este email usando otro método de inicio de sesión.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      return; // No mostrar error si el usuario canceló
    }
    
    // Mostrar alerta
    alertMessage.value = errorMessage;
    alertTitle.value = errorTitle;
    
    if (alertModal.value) {
      alertModal.value.show();
    }
  }
};

onMounted(() => {
  // Inicializar los modales con Bootstrap
  try {
    // Intentar usar bootstrap desde la instancia Nuxt
    if ($bootstrap && $bootstrap.Modal) {
      const loginModalEl = document.getElementById('loginModal');
      const alertModalEl = document.getElementById('alertModal');
      
      if (loginModalEl) {
        loginModal.value = new $bootstrap.Modal(loginModalEl);
      }
      
      if (alertModalEl) {
        alertModal.value = new $bootstrap.Modal(alertModalEl);
      }
    }
    // Si no está disponible, intentar usar window.bootstrap
    else if (typeof window !== 'undefined' && window.bootstrap) {
      const loginModalEl = document.getElementById('loginModal');
      const alertModalEl = document.getElementById('alertModal');
      
      if (loginModalEl) {
        loginModal.value = new window.bootstrap.Modal(loginModalEl);
      }
      
      if (alertModalEl) {
        alertModal.value = new window.bootstrap.Modal(alertModalEl);
      }
    }
  } catch (error) {
    console.error('Error al inicializar modales:', error);
  }
});
</script> 