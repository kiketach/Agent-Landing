import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isLoading: false,
  }),
  
  getters: {
    cartCount: (state) => state.items.length,
    
    subtotal: (state) => {
      if (!state.items || !state.items.length) {
        return 0;
      }
      return state.items.reduce((total, item) => {
        const price = item && item.price ? Number(item.price) : 0;
        const quantity = item && item.quantity ? Number(item.quantity) : 1;
        return total + (price * quantity);
      }, 0);
    },
    
    shippingCost: (state) => {
      return state.items.length > 0 ? 15000 : 0; // Costo fijo de envío
    },
    
    total: (state) => {
      return state.subtotal + state.shippingCost;
    },
  },
  
  actions: {
    async addToCart(product) {
      // Calcular el precio basado en el tipo de producto si no está establecido
      let calculatedPrice = 0;
      
      if (product.price && typeof product.price === 'number' && product.price > 0) {
        calculatedPrice = product.price;
      } else {
        // Precio fallback según el tipo de zapatilla
        calculatedPrice = product.title?.toLowerCase().includes('sintetik') || 
                         product.title?.toLowerCase().includes('sala') || 
                         product.title?.toLowerCase().includes('copa') 
                         ? 89900 : 99900;
      }
      
      // Asegurarse de que el precio siempre es un número
      const validatedProduct = {
        ...product,
        price: calculatedPrice,
        quantity: product.quantity || 1
      };
      
      console.log('Añadiendo producto al carrito:', validatedProduct);
      
      this.items.push(validatedProduct);
      await this.saveCartToFirestore();
    },
    
    async removeFromCart(index) {
      this.items.splice(index, 1);
      await this.saveCartToFirestore();
    },
    
    async clearCart() {
      this.items = [];
      await this.saveCartToFirestore();
    },
    
    async loadCartFromFirestore() {
      this.isLoading = true;
      
      try {
        const nuxtApp = useNuxtApp();
        
        // Verificar que Firebase está disponible
        if (!nuxtApp.$firebase) {
          console.error('Firebase no está disponible en el contexto de Nuxt');
          return;
        }
        
        const { auth, db } = nuxtApp.$firebase;
        
        if (auth.currentUser) {
          const { doc, getDoc } = await import('firebase/firestore');
          const cartRef = doc(db, "carritos", auth.currentUser.uid);
          const docSnap = await getDoc(cartRef);
          
          if (docSnap.exists() && docSnap.data().items) {
            this.items = docSnap.data().items;
          }
        }
      } catch (error) {
        console.error("Error al cargar el carrito desde Firestore:", error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async saveCartToFirestore() {
      try {
        const nuxtApp = useNuxtApp();
        
        // Verificar que Firebase está disponible
        if (!nuxtApp.$firebase) {
          console.error('Firebase no está disponible en el contexto de Nuxt');
          return;
        }
        
        const { auth, db } = nuxtApp.$firebase;
        
        if (auth.currentUser) {
          const { setDoc, doc, getDoc } = await import('firebase/firestore');
          const cartRef = doc(db, "carritos", auth.currentUser.uid);
          const docSnap = await getDoc(cartRef);
          
          if (docSnap.exists()) {
            const currentData = docSnap.data();
            await setDoc(cartRef, {
              ...currentData,
              items: this.items,
              userInfo: {
                ...currentData.userInfo,
                lastUpdated: new Date()
              }
            }, { merge: true });
          } else {
            await setDoc(cartRef, {
              items: this.items,
              userInfo: {
                name: auth.currentUser.displayName || 'Usuario',
                email: auth.currentUser.email,
                lastUpdated: new Date()
              }
            });
          }
        }
      } catch (error) {
        console.error("Error al guardar el carrito en Firestore:", error);
      }
    }
  }
}); 