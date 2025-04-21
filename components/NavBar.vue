<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="/">
        <img src="~/assets/img/Logo.png" alt="Logo Hat Trick" style="height: 40px;" class="me-2">
        <span class="d-none d-lg-inline">Inicio</span>
      </a>
      
      <!-- Información del usuario para móvil -->
      <div class="d-lg-none mobile-user-section">
        <div v-if="authStore.isLoggedIn" class="mobile-user-info">
          <span class="user-greeting">¡Hola, {{ getUserName }}!</span>
          <a class="nav-link logout-link" href="#" @click="logout">
            Cerrar Sesión
          </a>
        </div>
        <a 
          v-else 
          class="nav-link text-white"
          href="#" 
          @click="openLoginModal"
        >
          Iniciar Sesión
        </a>
      </div>
      
      <button 
        class="navbar-toggler ms-3" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarResponsive" 
        aria-controls="navbarResponsive" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        Menú
        <i class="fas fa-bars ms-1"></i>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/catalogo">Catálogo</NuxtLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click="openChatModal">Habla con nosotros</a>
          </li>
          
          <!-- Información del usuario y botones de sesión para desktop -->
          <li class="nav-item d-none d-lg-block" v-if="!authStore.isLoggedIn">
            <a class="nav-link" href="#" @click="openLoginModal">
              Iniciar Sesión
            </a>
          </li>
          
          <!-- Nombre de usuario y botón de cerrar sesión en horizontal para desktop -->
          <li class="nav-item d-none d-lg-flex align-items-center" v-else>
            <span class="user-greeting me-3">¡HOLA, {{ getUserName.toUpperCase() }}!</span>
            <a class="nav-link" href="#" @click="logout">
              CERRAR SESIÓN
            </a>
          </li>
          
          <!-- Carrito en el navbar -->
          <li class="nav-item">
            <a class="nav-link position-relative" href="#" @click="openCartModal">
              <i class="fas fa-shopping-cart"></i>
              <span 
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ cartStore.cartCount }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '~/stores/authStore';
import { useCartStore } from '~/stores/cartStore';
import { useNuxtApp } from '#app';

// Acceder a las stores y plugins
const authStore = useAuthStore();
const cartStore = useCartStore();
const { $bootstrap } = useNuxtApp();

// Referencia a los modales
const loginModal = ref(null);
const chatModal = ref(null);
const cartModal = ref(null);

// Estado para controlar inicio de sesión y carrito
const userLoggedIn = ref(false);
const cartCount = ref(0);

// Computado para obtener el nombre del usuario
const getUserName = computed(() => {
  if (authStore.user && authStore.user.displayName) {
    // Si el nombre tiene espacios, devolver solo el primer nombre
    const nameParts = authStore.user.displayName.split(' ');
    return nameParts[0];
  }
  return 'Usuario';
});

// Métodos para manejar modales y eventos
const openLoginModal = () => {
  // Buscar el modal en el DOM
  const modalEl = document.getElementById('loginModal');
  if (modalEl) {
    try {
      // Intentar usar bootstrap desde la instancia Nuxt
      if ($bootstrap && $bootstrap.Modal) {
        const modalInstance = $bootstrap.Modal.getInstance(modalEl) || new $bootstrap.Modal(modalEl);
        modalInstance.show();
      }
      // Si no está disponible, intentar usar window.bootstrap
      else if (typeof window !== 'undefined' && window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        modalInstance.show();
      }
      else {
        console.warn('Bootstrap no está disponible');
      }
    } catch (error) {
      console.error('Error al abrir modal de login:', error);
    }
  }
};

const openChatModal = () => {
  // Buscar el modal en el DOM
  const modalEl = document.getElementById('chatModal');
  if (modalEl) {
    try {
      // Intentar usar bootstrap desde la instancia Nuxt
      if ($bootstrap && $bootstrap.Modal) {
        const modalInstance = $bootstrap.Modal.getInstance(modalEl) || new $bootstrap.Modal(modalEl);
        modalInstance.show();
      }
      // Si no está disponible, intentar usar window.bootstrap
      else if (typeof window !== 'undefined' && window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        modalInstance.show();
      }
      else {
        console.warn('Bootstrap no está disponible');
      }
    } catch (error) {
      console.error('Error al abrir modal de chat:', error);
    }
  }
};

const openCartModal = () => {
  // Buscar el modal en el DOM
  const modalEl = document.getElementById('carritoModal');
  if (modalEl) {
    try {
      // Intentar usar bootstrap desde la instancia Nuxt
      if ($bootstrap && $bootstrap.Modal) {
        const modalInstance = $bootstrap.Modal.getInstance(modalEl) || new $bootstrap.Modal(modalEl);
        modalInstance.show();
      }
      // Si no está disponible, intentar usar window.bootstrap
      else if (typeof window !== 'undefined' && window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        modalInstance.show();
      }
      else {
        console.warn('Bootstrap no está disponible');
      }
    } catch (error) {
      console.error('Error al abrir modal del carrito:', error);
    }
  }
};

const logout = async () => {
  try {
    await authStore.logout();
    // Limpiar carrito al cerrar sesión
    cartStore.clearCart();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

onMounted(() => {
  // Inicializar navbar y comprobar estado de sesión
  const navbarShrink = () => {
    const navbarCollapsible = document.body.querySelector('#mainNav');
    if (!navbarCollapsible) return;
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove('navbar-shrink');
    } else {
      navbarCollapsible.classList.add('navbar-shrink');
    }
  };

  navbarShrink();
  document.addEventListener('scroll', navbarShrink);
  
  // Agregar ScrollSpy si está disponible
  try {
    // Intentar usar bootstrap desde la instancia Nuxt
    if ($bootstrap && $bootstrap.ScrollSpy) {
      const mainNav = document.body.querySelector('#mainNav');
      if (mainNav) {
        new $bootstrap.ScrollSpy(document.body, {
          target: '#mainNav',
          rootMargin: '0px 0px -40%',
        });
      }
    }
    // Si no está disponible, intentar usar window.bootstrap
    else if (typeof window !== 'undefined' && window.bootstrap) {
      const mainNav = document.body.querySelector('#mainNav');
      if (mainNav) {
        new window.bootstrap.ScrollSpy(document.body, {
          target: '#mainNav',
          rootMargin: '0px 0px -40%',
        });
      }
    }
  } catch (error) {
    console.error('Error al inicializar ScrollSpy:', error);
  }
});
</script>

<style scoped>
#mainNav {
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: #212529;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  transition: padding-top 0.3s ease-in-out, padding-bottom 0.3s ease-in-out;
}

#mainNav .navbar-toggler {
  font-size: 0.875rem;
  padding: 0.75rem;
  color: white;
  border: 1px solid white;
}

#mainNav .navbar-brand img {
  height: 40px;
}

#mainNav.navbar-shrink {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: #212529;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.nav-link {
  color: white !important;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.75rem 0;
  letter-spacing: 0.1rem;
}

/* Estilos para el saludo de usuario */
.user-greeting {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #ffc800;
  letter-spacing: 0.1rem;
}

/* Estilos para vista móvil */
.mobile-user-section {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 10px;
}

.mobile-user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.mobile-user-info .user-greeting {
  font-size: 0.9rem;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.1rem;
}

@media (max-width: 991.98px) {
  .navbar .container {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }
  
  .navbar-brand img {
    height: 35px !important;
  }
  
  .mobile-user-info .nav-link {
    padding: 0.25rem 0;
    font-size: 0.85rem;
  }
  
  .mobile-user-info .user-greeting {
    font-size: 0.8rem;
  }
  
  /* Fix para menú móvil */
  #navbarResponsive {
    clear: both;
    width: 100%;
    margin-top: 0.5rem;
  }
}

@media (min-width: 992px) {
  #mainNav {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    border: none;
    transition: padding-top 0.3s ease-in-out, padding-bottom 0.3s ease-in-out;
    background-color: #212529;
  }
  
  #mainNav .nav-link {
    padding: 1.5rem 1rem;
    color: white !important;
  }
  
  #mainNav .nav-link:hover {
    color: #ffc800 !important;
  }

  #mainNav.navbar-shrink {
    padding-top: 1rem;
    padding-bottom: 1rem;
    background-color: #212529;
  }
  
  #mainNav.navbar-shrink .navbar-brand img {
    height: 2rem;
  }
  
  /* Alinear bien el nombre y cerrar sesión */
  .user-greeting {
    margin-bottom: 0;
  }
}

/* Ajustar enlace de logout para que se vea similar */
.nav-item .nav-link[href="#"][onclick] {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.1rem;
}
</style> 