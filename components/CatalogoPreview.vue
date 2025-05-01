<template>
  <div class="row" id="catalogo">
    <!-- ZAMBA -->
    <div class="col-lg-4 col-sm-6 mb-4">
      <div class="portfolio-item">
        <a class="portfolio-link" @click="openProductModal('Zamba', '100% cuero.', 'Zamba2.png', ['Zamba1.png', 'Zamba2.png', 'Zamba3.png', 'Zamba4.png', 'Zamba5.png', 'Zamba6.png', 'Zamba7.png'], 99900)">
          <div class="portfolio-hover">
            <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
          </div>
          <img class="img-fluid" src="~/assets/img/portfolio/Zamba2.png" alt="Zamba" />
        </a>
        <div class="portfolio-caption">
          <div class="portfolio-caption-heading">Zamba</div>
          <div class="portfolio-caption-subheading text-muted">100% Cuero</div>
          <p class="price text-primary">$99.900</p>
        </div>
      </div>
    </div>
    
    <!-- MASTER -->
    <div class="col-lg-4 col-sm-6 mb-4">
      <div class="portfolio-item">
        <a class="portfolio-link" @click="openProductModal('Master', '100% cuero.', 'Master2.png', ['Master1.png', 'Master2.png', 'Master3.png', 'Master4.png', 'Master5.png', 'Master6.png', 'Master7.png'], 99900)">
          <div class="portfolio-hover">
            <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
          </div>
          <img class="img-fluid" src="~/assets/img/portfolio/Master2.png" alt="Master" />
        </a>
        <div class="portfolio-caption">
          <div class="portfolio-caption-heading">Master</div>
          <div class="portfolio-caption-subheading text-muted">100% Cuero</div>
          <p class="price text-primary">$99.900</p>
        </div>
      </div>
    </div>
    
    <!-- SINTETIK -->
    <div class="col-lg-4 col-sm-6 mb-4">
      <div class="portfolio-item">
        <a class="portfolio-link" @click="openProductModal('Sintetik', 'Sintético Alta Calidad.', 'Sintetik1.png', ['Sintetik1.png', 'Sintetik2.png', 'Sintetik3.png', 'Sintetik4.png', 'Sintetik5.png', 'Sintetik6.png', 'Sintetik7.png'], 89900)">
          <div class="portfolio-hover">
            <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
          </div>
          <img class="img-fluid" src="~/assets/img/portfolio/Sintetik1.png" alt="Sintetik" />
        </a>
        <div class="portfolio-caption">
          <div class="portfolio-caption-heading">Sintetik</div>
          <div class="portfolio-caption-subheading text-muted">Sintético Alta Calidad</div>
          <p class="price text-primary">$89.900</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modal de Producto -->
  <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="productModalLabel">{{ selectedProduct.title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-7">
              <img :src="getImageUrl(selectedProduct.mainImage)" 
                   :alt="selectedProduct.title" 
                   class="img-fluid" 
                   @click="showZoomedImage(selectedProduct.mainImage)" />
              
              <div class="row mt-3">
                <div v-for="(image, index) in selectedProduct.images" :key="index" class="col-3 mb-2">
                  <img :src="getImageUrl(image)" 
                       :alt="`${selectedProduct.title} - ${index + 1}`" 
                       class="img-fluid thumbnail" 
                       @click="selectedProduct.mainImage = image" />
                </div>
              </div>
            </div>
            <div class="col-md-5">
              <h4>{{ selectedProduct.title }}</h4>
              <p>{{ selectedProduct.description }}</p>
              <p class="text-primary fs-4 fw-bold">
                ${{ formatPrice(selectedProduct.price) }}
              </p>
              
              <div class="mb-3">
                <label class="form-label">Talla</label>
                <select class="form-select" v-model="selectedProduct.talla">
                  <option value="" disabled selected>Seleccione su talla</option>
                  <option value="35">35</option>
                  <option value="36">36</option>
                  <option value="37">37</option>
                  <option value="38">38</option>
                  <option value="39">39</option>
                  <option value="40">40</option>
                  <option value="41">41</option>
                  <option value="42">42</option>
                  <option value="43">43</option>
                  <option value="44">44</option>
                </select>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Tipo de Suela</label>
                <select class="form-select" v-model="selectedProduct.suela">
                  <option value="" disabled selected>Seleccione tipo de suela</option>
                  <option value="Goma">Goma</option>
                  <option value="Colores">Colores</option>
                  <option value="Negra">Negra</option>
                  <option value="Torretin">Torretin</option>
                </select>
              </div>
              
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="selectedProduct.personalizado" id="personalizado">
                  <label class="form-check-label" for="personalizado">
                    Personalizar
                  </label>
                </div>
              </div>
              
              <div v-if="selectedProduct.personalizado" class="mb-3">
                <div class="row">
                  <div class="col-md-8">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" v-model="selectedProduct.nombre" maxlength="10">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Número</label>
                    <input type="number" class="form-control" v-model="selectedProduct.numero" min="1" max="99">
                  </div>
                </div>
              </div>
              
              <button class="btn btn-primary w-100" @click="addToCart">
                Agregar al Carrito
              </button>
              
              <button class="btn btn-outline-primary w-100 mt-2" @click="handleChatClick">
                Hablar con un asesor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modal de Zoom -->
  <div class="modal fade" id="zoomModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-body p-0">
          <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
          <img :src="zoomImage" class="img-fluid w-100" alt="Imagen ampliada">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '~/stores/cartStore';

const productModal = ref(null);
const zoomModal = ref(null);
const zoomImage = ref('');

const selectedProduct = ref({
  title: '',
  description: '',
  mainImage: '',
  images: [],
  price: 0,
  talla: '',
  suela: '',
  personalizado: false,
  nombre: '',
  numero: ''
});

const cartStore = useCartStore();

const handleChatClick = () => {
  // Obtener el número/color del modelo desde el nombre de la imagen
  const modeloEspecifico = selectedProduct.value.mainImage.replace('.png', '');
  
  const productDetails = {
    title: selectedProduct.value.title,
    description: selectedProduct.value.description,
    modelo: modeloEspecifico,
    talla: selectedProduct.value.talla || 'no seleccionada',
    suela: selectedProduct.value.suela || 'no seleccionada',
    price: formatPrice(selectedProduct.value.price)
  };
  
  const mensaje = `Hola, estoy interesado en el modelo ${productDetails.title} ${productDetails.modelo} (${productDetails.description}) con talla ${productDetails.talla} y suela ${productDetails.suela}. Precio: $${productDetails.price}`;
  
  // Crear y disparar el evento personalizado
  const event = new CustomEvent('abrir-chat', { detail: mensaje });
  window.dispatchEvent(event);
  
  if (productModal.value) {
    productModal.value.hide();
  }
};

// Función para obtener la URL de la imagen
const getImageUrl = (image) => {
  return new URL(`/assets/img/portfolio/${image}`, import.meta.url).href;
};

const openProductModal = (title, description, mainImage, images, price) => {
  selectedProduct.value = {
    title,
    description,
    mainImage,
    images,
    price,
    talla: '',
    suela: '',
    personalizado: false,
    nombre: '',
    numero: ''
  };
  
  if (productModal.value) {
    productModal.value.show();
  }
};

const showZoomedImage = (image) => {
  zoomImage.value = getImageUrl(image);
  if (zoomModal.value) {
    zoomModal.value.show();
  }
};

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

const addToCart = () => {
  // Crear objeto del producto para agregar al carrito
  const product = {
    title: selectedProduct.value.title,
    image: selectedProduct.value.mainImage,
    talla: selectedProduct.value.talla,
    suela: selectedProduct.value.suela,
    personalizado: selectedProduct.value.personalizado,
    nombre: selectedProduct.value.nombre,
    numero: selectedProduct.value.numero,
    price: selectedProduct.value.price
  };
  
  // Usar la store para agregar al carrito
  cartStore.addToCart(product);
  
  // Cerrar modal
  if (productModal.value) {
    productModal.value.hide();
  }
};

onMounted(() => {
  // Inicializar modales usando Bootstrap
  if (typeof bootstrap !== 'undefined') {
    const productModalEl = document.getElementById('productModal');
    const zoomModalEl = document.getElementById('zoomModal');
    
    if (productModalEl) {
      productModal.value = new bootstrap.Modal(productModalEl);
    }
    
    if (zoomModalEl) {
      zoomModal.value = new bootstrap.Modal(zoomModalEl);
    }
  }
});
</script>

<style scoped>
.portfolio-item {
  cursor: pointer;
  overflow: hidden;
  border-radius: 0.3rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.portfolio-link {
  position: relative;
  display: block;
  margin: 0 auto;
}

.portfolio-hover {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(254, 209, 54, 0.9);
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity ease-in-out 0.25s;
}

.portfolio-hover:hover {
  opacity: 1;
}

.portfolio-hover-content {
  color: white;
}

.portfolio-caption {
  padding: 1.5rem;
  text-align: center;
  background-color: #fff;
}

.portfolio-caption-heading {
  font-size: 1.5rem;
  font-family: "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-weight: 700;
  margin-bottom: 0;
}

.portfolio-caption-subheading {
  font-style: italic;
  font-family: "Roboto Slab", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.thumbnail {
  cursor: pointer;
  border: 1px solid #dee2e6;
  transition: border-color 0.15s ease-in-out;
}

.thumbnail:hover {
  border-color: #0d6efd;
}
</style> 