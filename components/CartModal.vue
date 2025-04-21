<template>
  <div class="modal fade" id="carritoModal" tabindex="-1" aria-labelledby="carritoModalLabel" aria-hidden="true" ref="carritoModalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="carritoModalLabel">
            <ClientOnly><i class="fas fa-shopping-cart me-2"></i></ClientOnly> Carrito de Compras
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <client-only>
            <div v-if="cartStore.items.length === 0" class="text-center text-muted my-5">
              <ClientOnly><i class="fas fa-shopping-cart fa-3x mb-3"></i></ClientOnly>
              <p>Aquí se mostrarán las zapatillas que compres.</p>
            </div>
            <div v-else>
              <div v-for="(producto, index) in cartStore.items" :key="index" class="list-group-item mb-2 border rounded">
                <div class="d-flex justify-content-between align-items-start gap-3">
                  <div class="d-flex gap-3 flex-grow-1">
                    <img :src="getImageUrl(producto.image)" 
                         :alt="producto.title" 
                         class="rounded" 
                         style="width: 100px; height: 100px; object-fit: cover;">
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="mb-0">{{ producto.title }}</h6>
                        <span class="text-success fw-bold">${{ formatPrice(getProductPrice(producto)) }}</span>
                      </div>
                      <div class="text-muted small mb-1">
                        Talla: {{ producto.talla }} | Suela: {{ producto.suela }}
                      </div>
                      <div v-if="producto.personalizado" class="text-primary small fw-bold">
                        Personalización: {{ producto.nombre || '' }} | #{{ producto.numero || '' }}
                      </div>
                    </div>
                  </div>
                  <button class="btn-close" @click="eliminarProducto(index)" aria-label="Eliminar"></button>
                </div>
              </div>
              
              <!-- Total -->
              <div class="mt-3 p-3 bg-light rounded border">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold fs-5">Total de la compra:</span>
                  <span class="fw-bold text-success fs-4">${{ formatPrice(getTotal()) }}</span>
                </div>
              </div>
            </div>
            <template #fallback>
              <div class="text-center p-4">
                <span>Cargando...</span>
              </div>
            </template>
          </client-only>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="vaciarCarritoSimple" :disabled="cartStore.items.length === 0">
            Vaciar Carrito
          </button>
          <button 
            type="button"
            class="btn btn-primary"
            :class="{ 'disabled': cartStore.items.length === 0 }"
            @click="procederAlPago"
            :disabled="cartStore.items.length === 0"
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '~/stores/cartStore';
import { useRouter } from 'vue-router';

// Acceder a la store del carrito
const cartStore = useCartStore();
const router = useRouter();

// Refs para el modal
const carritoModalRef = ref(null);
let modalInstance = null;

onMounted(async () => {
  if (process.client && carritoModalRef.value) {
    const { Modal } = await import('bootstrap');
    modalInstance = new Modal(carritoModalRef.value);
  }
});

// Función para obtener la URL de la imagen
const getImageUrl = (image) => {
  if (!image) return '';
  try {
    return new URL(`/assets/img/portfolio/${image}`, import.meta.url).href;
  } catch (error) {
    console.error('Error al cargar imagen:', error);
    return '';
  }
};

// Obtener el precio correcto de un producto
const getProductPrice = (producto) => {
  if (!producto) return 0;
  
  if (producto.price && typeof producto.price === 'number' && producto.price > 0) {
    return producto.price;
  }
  
  // Precio fallback según el tipo de zapatilla
  if (producto.title) {
    return producto.title.toLowerCase().includes('sintetik') || 
           producto.title.toLowerCase().includes('sala') || 
           producto.title.toLowerCase().includes('copa') 
           ? 89900 : 99900;
  }
  
  return 99900; // Valor por defecto
};

// Calcular el total del carrito
const getTotal = () => {
  if (!cartStore.items || !cartStore.items.length) {
    return 0;
  }
  
  return cartStore.items.reduce((total, item) => {
    if (!item) return total;
    const price = getProductPrice(item);
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);
};

// Formatear precio
const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return '0';
  }
  
  // Asegurar que el precio es un número
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    console.error('Error en el formato de precio:', price);
    return '0';
  }
  
  try {
    return numericPrice.toLocaleString('es-CO');
  } catch (error) {
    console.error('Error al formatear precio:', error);
    return numericPrice.toString();
  }
};

// Eliminar producto del carrito
const eliminarProducto = (index) => {
  cartStore.removeFromCart(index);
};

// Vaciar carrito - método simplificado
const vaciarCarritoSimple = () => {
  cartStore.clearCart();
};

// Método para proceder al pago
const procederAlPago = () => {
  if (cartStore.items.length === 0) {
    return;
  }

  if (modalInstance) {
    modalInstance.hide();
  }
  
  if (carritoModalRef.value) {
    carritoModalRef.value.addEventListener('hidden.bs.modal', () => {
      router.push('/compra');
    }, { once: true });
  } else {
    router.push('/compra');
  }
};
</script> 