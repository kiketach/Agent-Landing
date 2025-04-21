<template>
  <div>
    <section class="page-section bg-light">
      <div class="container">
        <div class="text-center">
          <h2 class="section-heading text-uppercase">Finalizar Compra</h2>
          <h3 class="section-subheading text-muted">Completa tu información para procesar tu pedido</h3>
        </div>
        
        <div class="row">
          <!-- Información del Cliente -->
          <div class="col-lg-8">
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title mb-4">Información de Contacto</h5>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="nombre" class="form-label">Nombre completo</label>
                    <input type="text" class="form-control" id="nombre" v-model="cliente.nombre" placeholder="Tu nombre completo">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="telefono" class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" id="telefono" v-model="cliente.telefono" placeholder="Tu número de teléfono">
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="email" class="form-label">Correo electrónico</label>
                  <input type="email" class="form-control" id="email" v-model="cliente.email" placeholder="correo@ejemplo.com">
                </div>
                
                <h5 class="card-title mb-4 mt-4">Dirección de Envío</h5>
                
                <div class="mb-3">
                  <label for="direccion" class="form-label">Dirección</label>
                  <input type="text" class="form-control" id="direccion" v-model="cliente.direccion" placeholder="Tu dirección completa">
                </div>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="ciudad" class="form-label">Ciudad</label>
                    <input type="text" class="form-control" id="ciudad" v-model="cliente.ciudad" placeholder="Ciudad">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="departamento" class="form-label">Departamento</label>
                    <select class="form-select" id="departamento" v-model="cliente.departamento">
                      <option value="">Selecciona...</option>
                      <option value="Amazonas">Amazonas</option>
                      <option value="Antioquia">Antioquia</option>
                      <option value="Arauca">Arauca</option>
                      <option value="Atlántico">Atlántico</option>
                      <option value="Bolívar">Bolívar</option>
                      <option value="Boyacá">Boyacá</option>
                      <option value="Caldas">Caldas</option>
                      <option value="Caquetá">Caquetá</option>
                      <option value="Casanare">Casanare</option>
                      <option value="Cauca">Cauca</option>
                      <option value="Cesar">Cesar</option>
                      <option value="Chocó">Chocó</option>
                      <option value="Córdoba">Córdoba</option>
                      <option value="Cundinamarca">Cundinamarca</option>
                      <option value="Guainía">Guainía</option>
                      <option value="Guaviare">Guaviare</option>
                      <option value="Huila">Huila</option>
                      <option value="La Guajira">La Guajira</option>
                      <option value="Magdalena">Magdalena</option>
                      <option value="Meta">Meta</option>
                      <option value="Nariño">Nariño</option>
                      <option value="Norte de Santander">Norte de Santander</option>
                      <option value="Putumayo">Putumayo</option>
                      <option value="Quindío">Quindío</option>
                      <option value="Risaralda">Risaralda</option>
                      <option value="San Andrés y Providencia">San Andrés y Providencia</option>
                      <option value="Santander">Santander</option>
                      <option value="Sucre">Sucre</option>
                      <option value="Tolima">Tolima</option>
                      <option value="Valle del Cauca">Valle del Cauca</option>
                      <option value="Vaupés">Vaupés</option>
                      <option value="Vichada">Vichada</option>
                    </select>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="observaciones" class="form-label">Observaciones (opcional)</label>
                  <textarea class="form-control" id="observaciones" v-model="cliente.observaciones" rows="3" placeholder="Información adicional sobre tu pedido o dirección de entrega"></textarea>
                </div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-body">
                <h5 class="card-title mb-4">Método de Pago</h5>
                
                <div class="form-check mb-3">
                  <input class="form-check-input" type="radio" name="metodoPago" id="transferencia" value="transferencia" v-model="metodoPago" checked>
                  <label class="form-check-label" for="transferencia">
                    Transferencia Bancaria
                  </label>
                  <div v-if="metodoPago === 'transferencia'" class="alert alert-info mt-2">
                    <p class="mb-1"><strong>Banco:</strong> Bancolombia</p>
                    <p class="mb-1"><strong>Cuenta de Ahorros:</strong> 123-456789-10</p>
                    <p class="mb-1"><strong>Titular:</strong> Hat Trick SAS</p>
                    <p class="mb-0">Envía el comprobante de pago al WhatsApp: +573146187857</p>
                  </div>
                </div>
                
                <div class="form-check mb-3">
                  <input class="form-check-input" type="radio" name="metodoPago" id="nequi" value="nequi" v-model="metodoPago">
                  <label class="form-check-label" for="nequi">
                    Nequi
                  </label>
                  <div v-if="metodoPago === 'nequi'" class="alert alert-info mt-2">
                    <p class="mb-1"><strong>Número:</strong> 314 618 7857</p>
                    <p class="mb-0">Envía el comprobante de pago al WhatsApp: +573146187857</p>
                  </div>
                </div>
                
                <div class="form-check mb-3">
                  <input class="form-check-input" type="radio" name="metodoPago" id="contraentrega" value="contraentrega" v-model="metodoPago">
                  <label class="form-check-label" for="contraentrega">
                    Pago Contra Entrega (Solo Bogotá)
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Resumen del Pedido -->
          <div class="col-lg-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title mb-4">Resumen del Pedido</h5>
                
                <client-only>
                  <div v-if="cartStore.items.length === 0" class="text-center text-muted my-5">
                    <i class="fas fa-shopping-cart fa-3x mb-3"></i>
                    <p>Tu carrito está vacío.</p>
                    <NuxtLink to="/catalogo" class="btn btn-primary">Ver Catálogo</NuxtLink>
                  </div>
                  
                  <div v-else>
                    <div v-for="(producto, index) in cartStore.items" :key="index" class="d-flex mb-3 border-bottom pb-3">
                      <img :src="getImageUrl(producto.image)" class="rounded" width="60" height="60" style="object-fit: cover;" :alt="producto.title">
                      <div class="ms-3">
                        <h6 class="mb-0">{{ producto.title }}</h6>
                        <div class="small text-muted">
                          Talla: {{ producto.talla }} | Suela: {{ producto.suela }}
                        </div>
                        <div v-if="producto.personalizado" class="small text-primary">
                          {{ producto.nombre || '' }} #{{ producto.numero || '' }}
                        </div>
                        <div class="mt-1">${{ formatPrice(getProductPrice(producto)) }}</div>
                      </div>
                    </div>
                    
                    <div class="d-flex justify-content-between border-bottom py-2">
                      <span>Subtotal:</span>
                      <span>${{ formatPrice(getSubtotal()) }}</span>
                    </div>
                    
                    <div class="d-flex justify-content-between border-bottom py-2">
                      <span>Envío:</span>
                      <span>${{ formatPrice(getShippingCost()) }}</span>
                    </div>
                    
                    <div class="d-flex justify-content-between py-3">
                      <span class="fw-bold">Total:</span>
                      <span class="fw-bold fs-5">${{ formatPrice(getTotal()) }}</span>
                    </div>
                    
                    <button 
                      class="btn btn-primary w-100 mt-3" 
                      @click="procesarPedido"
                      :disabled="!formularioValido || procesando"
                    >
                      <span v-if="procesando" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Finalizar Compra
                    </button>
                  </div>
                  <template #fallback>
                    <div class="text-center p-4">
                      <span>Cargando...</span>
                    </div>
                  </template>
                </client-only>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal de Éxito -->
    <PedidoExitoModal ref="pedidoExitoModalRef" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { useAuthStore } from '~/stores/authStore';
import { useCartStore } from '~/stores/cartStore';
import PedidoExitoModal from '~/components/PedidoExitoModal.vue';

// Definir layout para esta página
definePageMeta({
  layout: 'default'
});

// Acceder a las stores
const authStore = useAuthStore();
const cartStore = useCartStore();

// Ref para el modal de éxito
const pedidoExitoModalRef = ref(null);

// Función para obtener la URL de la imagen
const getImageUrl = (image) => {
  return new URL(`/assets/img/portfolio/${image}`, import.meta.url).href;
};

// Estado para el formulario de compra
const metodoPago = ref('transferencia');
const procesando = ref(false);

// Información del cliente
const cliente = ref({
  nombre: '',
  telefono: '',
  email: '',
  direccion: '',
  ciudad: '',
  departamento: '',
  observaciones: ''
});

// Obtener el precio correcto de un producto
const getProductPrice = (producto) => {
  if (producto && producto.price && producto.price > 0) {
    return producto.price;
  }
  
  // Precio fallback según el tipo de zapatilla
  return producto.title?.toLowerCase().includes('sintetik') || 
         producto.title?.toLowerCase().includes('sala') || 
         producto.title?.toLowerCase().includes('copa') 
         ? 89900 : 99900;
};

// Calcular el subtotal del carrito
const getSubtotal = () => {
  if (!cartStore.items || cartStore.items.length === 0) {
    return 0;
  }
  
  return cartStore.items.reduce((total, item) => {
    const price = getProductPrice(item);
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);
};

// Obtener costo de envío
const getShippingCost = () => {
  return cartStore.items.length > 0 ? 15000 : 0;
};

// Calcular el total (subtotal + envío)
const getTotal = () => {
  return getSubtotal() + getShippingCost();
};

// Calcular subtotal
const subtotal = computed(() => {
  return getSubtotal();
});

// Costo de envío
const costoEnvio = computed(() => {
  return getShippingCost();
});

// Total
const total = computed(() => {
  return getTotal();
});

// Validar formulario
const formularioValido = computed(() => {
  return cliente.value.nombre.trim() !== '' &&
         cliente.value.telefono.trim() !== '' &&
         cliente.value.email.trim() !== '' &&
         cliente.value.direccion.trim() !== '' &&
         cliente.value.ciudad.trim() !== '' &&
         cliente.value.departamento.trim() !== '';
});

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

// Procesar pedido
const procesarPedido = async () => {
  if (!formularioValido.value) {
    alert('Por favor, completa todos los campos requeridos.');
    return;
  }
  
  procesando.value = true;
  
  try {
    const { $firebase } = useNuxtApp();
    const { auth, db } = $firebase;
    const { collection, addDoc, doc, deleteDoc } = await import('firebase/firestore');
    
    // Asegurar que los items tienen precios correctos
    const itemsConPreciosCorrectos = cartStore.items.map(item => ({
      ...item,
      price: getProductPrice(item)
    }));
    
    // Crear pedido en Firestore
    const pedidoData = {
      cliente: cliente.value,
      items: itemsConPreciosCorrectos,
      metodoPago: metodoPago.value,
      subtotal: getSubtotal(),
      costoEnvio: getShippingCost(),
      total: getTotal(),
      fechaCreacion: new Date(),
      estado: 'pendiente'
    };
    
    // Si el usuario está autenticado, agregar su ID
    if (authStore.isLoggedIn) {
      pedidoData.userId = authStore.user.uid;
      
      // Eliminar carrito después de procesar el pedido
      const carritoRef = doc(db, "carritos", authStore.user.uid);
      await deleteDoc(carritoRef);
    }
    
    // Guardar pedido
    await addDoc(collection(db, "pedidos"), pedidoData);
    
    // Limpiar carrito y mostrar modal de éxito
    await cartStore.clearCart();
    if (pedidoExitoModalRef.value) {
      pedidoExitoModalRef.value.show();
    }

  } catch (error) {
    console.error('Error al procesar el pedido:', error);
    alert('Ocurrió un error al procesar el pedido. Por favor, intenta nuevamente.');
  } finally {
    procesando.value = false;
  }
};

onMounted(async () => {
  // Pre-llenar información del usuario si está autenticado
  if (authStore.isLoggedIn) {
    cliente.value.nombre = authStore.user.displayName || '';
    cliente.value.email = authStore.user.email || '';
  }
});
</script>

<style scoped>
.page-section {
  padding-top: 8rem;
  padding-bottom: 6rem;
}

.section-heading {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
}

.section-subheading {
  font-family: 'Roboto Slab', serif;
  font-style: italic;
  margin-bottom: 4rem;
}
</style> 