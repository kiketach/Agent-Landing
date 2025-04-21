import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  
  const isLoggedIn = computed(() => !!user.value);
  
  async function initAuth() {
    const nuxtApp = useNuxtApp();
    
    // Verificar que Firebase está disponible
    if (!nuxtApp.$firebase) {
      console.error('Firebase no está disponible en el contexto de Nuxt');
      return null;
    }
    
    const { auth } = nuxtApp.$firebase;
    const { onAuthStateChanged } = await import('firebase/auth');
    
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (userData) => {
        if (userData) {
          user.value = {
            uid: userData.uid,
            email: userData.email,
            displayName: userData.displayName,
            photoURL: userData.photoURL
          };
        } else {
          user.value = null;
        }
        resolve(user.value);
      });
    });
  }
  
  // Inicio de sesión con Google
  async function loginWithGoogle() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const nuxtApp = useNuxtApp();
      
      // Verificar que Firebase está disponible
      if (!nuxtApp.$firebase) {
        throw new Error('Firebase no está disponible en el contexto de Nuxt');
      }
      
      const { auth } = nuxtApp.$firebase;
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      user.value = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      };
      
      return user.value;
    } catch (e) {
      console.error('Error al iniciar sesión con Google:', e);
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }
  
  // Inicio de sesión con Facebook
  async function loginWithFacebook() {
    isLoading.value = true;
    error.value = null;
    
    // Verificar si estamos en HTTPS para Facebook
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
      error.value = 'Facebook requiere una conexión segura (HTTPS) para el inicio de sesión.';
      isLoading.value = false;
      throw new Error(error.value);
    }
    
    try {
      const nuxtApp = useNuxtApp();
      
      // Verificar que Firebase está disponible
      if (!nuxtApp.$firebase) {
        throw new Error('Firebase no está disponible en el contexto de Nuxt');
      }
      
      const { auth } = nuxtApp.$firebase;
      const { FacebookAuthProvider, signInWithPopup } = await import('firebase/auth');
      
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      user.value = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      };
      
      return user.value;
    } catch (e) {
      console.error('Error al iniciar sesión con Facebook:', e);
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function login(email, password) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const nuxtApp = useNuxtApp();
      
      // Verificar que Firebase está disponible
      if (!nuxtApp.$firebase) {
        throw new Error('Firebase no está disponible en el contexto de Nuxt');
      }
      
      const { auth } = nuxtApp.$firebase;
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      };
      
      return user.value;
    } catch (e) {
      console.error('Error al iniciar sesión:', e);
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function register(name, email, password) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const nuxtApp = useNuxtApp();
      
      // Verificar que Firebase está disponible
      if (!nuxtApp.$firebase) {
        throw new Error('Firebase no está disponible en el contexto de Nuxt');
      }
      
      const { auth } = nuxtApp.$firebase;
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: name,
        photoURL: userCredential.user.photoURL
      };
      
      return user.value;
    } catch (e) {
      console.error('Error al registrarse:', e);
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function logout() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const nuxtApp = useNuxtApp();
      
      // Verificar que Firebase está disponible
      if (!nuxtApp.$firebase) {
        throw new Error('Firebase no está disponible en el contexto de Nuxt');
      }
      
      const { auth } = nuxtApp.$firebase;
      const { signOut } = await import('firebase/auth');
      
      await signOut(auth);
      user.value = null;
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }
  
  return {
    user,
    isLoading,
    error,
    isLoggedIn,
    initAuth,
    login,
    loginWithGoogle,
    loginWithFacebook,
    register,
    logout
  };
}); 