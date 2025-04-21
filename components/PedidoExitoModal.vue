<template>
  <div class="modal fade" ref="exitoModalRef" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title text-success" id="exitoModalLabel">
             <i class="fas fa-check-circle me-2"></i> ¡Pedido Realizado con Éxito!
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Tu pedido ha sido procesado correctamente.</p>
          <p>Te contactaremos pronto vía WhatsApp o correo electrónico para confirmar los detalles del envío y el pago (si aplica).</p>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-primary" @click="cerrarYRedirigir">Aceptar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from '#app'; // Usar auto-importación de Nuxt

const router = useRouter();
const exitoModalRef = ref(null);
let modalInstance = null;

// Props y Emits
const emit = defineEmits(['modal-closed']);

// Método para cerrar modal y redirigir
const cerrarYRedirigir = () => {
  if (modalInstance) {
    modalInstance.hide();
    // El evento 'hidden.bs.modal' se encargará de la redirección y emit
  } else {
    // Fallback si el modal no se instancia correctamente
    router.push('/');
    emit('modal-closed');
  }
};

// Función para manejar el evento de cierre del modal
const onModalHidden = () => {
  router.push('/');
  emit('modal-closed'); // Emitir evento cuando se cierra
};

// Mostrar el modal (método expuesto)
const show = () => {
  if (modalInstance) {
    modalInstance.show();
  }
};

// Ocultar el modal (método expuesto)
const hide = () => {
 if (modalInstance) {
    modalInstance.hide();
  }
};

// Exponer métodos para el componente padre
defineExpose({ show, hide });

// Inicializar y limpiar instancia del modal
onMounted(async () => {
  if (process.client && exitoModalRef.value) {
    const { Modal } = await import('bootstrap');
    modalInstance = new Modal(exitoModalRef.value);

    // Escuchar evento de cierre
    exitoModalRef.value.addEventListener('hidden.bs.modal', onModalHidden);
  }
});

onBeforeUnmount(() => {
  if (exitoModalRef.value) {
    // Limpiar el listener
    exitoModalRef.value.removeEventListener('hidden.bs.modal', onModalHidden);
  }
  // Bootstrap 5.3+ puede necesitar .dispose() si se recrea el modal
  // if (modalInstance) {
  //   modalInstance.dispose();
  // }
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style> 