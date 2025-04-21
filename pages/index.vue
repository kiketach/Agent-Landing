<template>
  <div>
    <!-- Masthead-->
    <header class="masthead">
      <div class="overlay"></div> 
      <div class="content">
        <h1 class="masthead-subheading">Tú juego - tú estilo</h1>
        <p class="masthead-subheading">Vive la experiencia Hat Trick</p>
      </div>
    </header>
    
    <!-- Services -->
    <section class="page-section" id="services">
      <div class="container">
        <div class="text-center">
          <h2 class="section-heading text-uppercase">Le ponemos la suela que necesites</h2>
          <h3 class="section-subheading text-muted">Máxima adaptación de tus zapatillas de acuerdo a la superficie de juego.</h3>
        </div>
        <div class="row text-center">
          <div class="col-md-4">
            <img src="~/assets/img/Goma.png" alt="Imagen de suela" class="img-fluid" style="max-width: 100%; height: auto;">
            <h4 class="my-3">Goma</h4>
            <p class="text-muted">Perfecta para superficies lisas y baldosas</p>
          </div>
          <div class="col-md-4">
            <img src="~/assets/img/Colores.png" alt="Imagen de suela" class="img-fluid" style="max-width: 100%; height: auto;">
            <h4 class="my-3">Colores o Negra</h4>
            <p class="text-muted">Especial para superficies exigentes como cemento y asfalto</p>
          </div>
          <div class="col-md-4">
            <img src="~/assets/img/Torretin.png" alt="Imagen de suela" class="img-fluid" style="max-width: 100%; height: auto;">
            <h4 class="my-3">Torretin</h4>
            <p class="text-muted">Ideal para grama o cesped sintético.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Catálogo Preview -->
    <section class="page-section bg-light">
      <div class="container">
        <div class="text-center">
          <h2 class="section-heading text-uppercase">Modelos en cuero y en sintético</h2>
          <h3 class="section-subheading text-muted">Aquí encontrarás el catálogo completo de todos nuestros modelos.</h3>
        </div>
        <CatalogoPreview />
        <div class="text-center mt-5">
          <NuxtLink to="/catalogo" class="btn btn-primary btn-xl text-uppercase">Ver catálogo completo</NuxtLink>
        </div>
      </div>
    </section>
    
    <!-- Nuestra Historia -->
    <section class="page-section" id="about">
      <div class="container">
        <div class="text-center">
          <h2 class="section-heading text-uppercase">Un poco de nuestra historia</h2>
          <h3 class="section-subheading text-muted">Queremos que nos conozcas.</h3>
        </div>
        <ul class="timeline">
          <li>
            <div class="timeline-image">
              <img class="rounded-circle img-fluid" src="~/assets/img/about/1.jpg" alt="Inicio Hat Trick" />
            </div>
            <div class="timeline-panel">
              <div class="timeline-heading">
                <h4>2020</h4>
                <h4 class="subheading">Nace Zapatillas Hat trick</h4>
              </div>
              <div class="timeline-body">
                <p class="text-muted">En un local de 20 metros cuadrados en Patio Bonito, Bogotá, con 2 empleados!</p>
              </div>
            </div>
          </li>
          <li class="timeline-inverted">
            <div class="timeline-image">
              <img class="rounded-circle img-fluid" src="~/assets/img/about/2.jpeg" alt="Crecimiento" />
            </div>
            <div class="timeline-panel">
              <div class="timeline-heading">
                <h4>2022</h4>
                <h4 class="subheading">El lugar quedó pequeño</h4>
              </div>
              <div class="timeline-body">
                <p class="text-muted">Un año después nos mudamos al barrio Quiroga! donde se arrienda una propiedad de 100 metros cuadrados y 10 empleados</p>
              </div>
            </div>
          </li>
          <li>
            <div class="timeline-image">
              <img class="rounded-circle img-fluid" src="~/assets/img/about/3.jpeg" alt="Expansión" />
            </div>
            <div class="timeline-panel">
              <div class="timeline-heading">
                <h4>2023</h4>
                <h4 class="subheading">Adquirimos maquinarias especializadas para cubrir la demanda</h4>
              </div>
              <div class="timeline-body">
                <p class="text-muted">La producción semanal para este punto a aumentado un 800%</p>
              </div>
            </div>
          </li>
          <li class="timeline-inverted">
            <div class="timeline-image">
              <img class="rounded-circle img-fluid" src="~/assets/img/about/4.jpg" alt="Futuro" />
            </div>
            <div class="timeline-panel">
              <div class="timeline-heading">
                <h4>2025</h4>
                <h4 class="subheading">Expansión</h4>
              </div>
              <div class="timeline-body">
                <p class="text-muted">Ya vendemos nuestras zapatillas a nivel nacional a mayoristas, minoristas y al público en general</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
// Importar el componente CatalogoPreview
import CatalogoPreview from '~/components/CatalogoPreview.vue';

definePageMeta({
  layout: 'default'
});
</script>

<style scoped>
.masthead {
  position: relative;
  height: 100vh;
  min-height: 650px;
  background-image: url('~/assets/img/Banner.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 0; /* Eliminar margen negativo */
  padding-top: 76px; /* Mantener padding superior */
}

.masthead .overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}

.masthead .content {
  position: relative;
  z-index: 1;
  color: white;
}

.masthead-subheading {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
}

.page-section {
  padding: 6rem 0;
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

/* Estilos para la línea de tiempo */
.timeline {
  position: relative;
  padding: 0;
  list-style: none;
}

.timeline:before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 40px;
  width: 2px;
  margin-left: -1px;
  content: "";
  background-color: #e9ecef;
}

.timeline > li {
  position: relative;
  min-height: 50px;
  margin-bottom: 50px;
}

.timeline > li:after, .timeline > li:before {
  display: table;
  content: " ";
}

.timeline > li:after {
  clear: both;
}

.timeline > li .timeline-panel {
  position: relative;
  float: right;
  width: 100%;
  padding: 0 20px 0 100px;
  text-align: left;
}

.timeline > li .timeline-panel:before {
  right: auto;
  left: -15px;
  border-right-width: 15px;
  border-left-width: 0;
}

.timeline > li .timeline-panel:after {
  right: auto;
  left: -14px;
  border-right-width: 14px;
  border-left-width: 0;
}

.timeline > li .timeline-image {
  position: absolute;
  z-index: 100;
  left: 0;
  width: 80px;
  height: 80px;
  margin-left: 0;
  text-align: center;
  color: white;
  border: 7px solid #e9ecef;
  border-radius: 100%;
  background-color: #fed136;
}

.timeline > li .timeline-image img {
  border-radius: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.timeline > li.timeline-inverted > .timeline-panel {
  float: right;
  padding: 0 20px 0 100px;
  text-align: left;
}

.timeline > li.timeline-inverted > .timeline-panel:before {
  right: auto;
  left: -15px;
  border-right-width: 15px;
  border-left-width: 0;
}

.timeline > li.timeline-inverted > .timeline-panel:after {
  right: auto;
  left: -14px;
  border-right-width: 14px;
  border-left-width: 0;
}

.timeline .timeline-heading h4 {
  margin-top: 0;
  color: inherit;
}

.timeline .timeline-heading h4.subheading {
  text-transform: none;
}

.timeline .timeline-body p {
  margin-bottom: 0;
}

@media (min-width: 768px) {
  .timeline:before {
    left: 50%;
  }
  
  .timeline > li {
    min-height: 100px;
    margin-bottom: 100px;
  }
  
  .timeline > li .timeline-panel {
    float: left;
    width: 41%;
    padding: 0 20px 20px 30px;
    text-align: right;
  }
  
  .timeline > li .timeline-image {
    left: 50%;
    width: 100px;
    height: 100px;
    margin-left: -50px;
  }
  
  .timeline > li.timeline-inverted > .timeline-panel {
    float: right;
    padding: 0 30px 20px 20px;
    text-align: left;
  }
}

@media (min-width: 992px) {
  .timeline > li {
    min-height: 150px;
  }
  
  .timeline > li .timeline-panel {
    padding: 0 20px 20px;
  }
  
  .timeline > li .timeline-image {
    width: 150px;
    height: 150px;
    margin-left: -75px;
  }
  
  .timeline > li.timeline-inverted > .timeline-panel {
    padding: 0 20px 20px;
  }
}

/* Ajustes para el banner en móvil */
@media (max-width: 767.98px) { /* O el breakpoint que prefieras para móvil */
  .masthead {
    height: 60vh; /* Igual que en catalogo.vue */
    min-height: 400px; /* Igual que en catalogo.vue */
  }

  .masthead-subheading {
    font-size: 1.8rem; /* Opcional: ajustar tamaño de fuente para móvil */
  }
}
</style> 