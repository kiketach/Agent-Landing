# Hat Trick - Tienda de Zapatillas

Proyecto de tienda en línea para zapatillas Hat Trick, desarrollado con Vue.js/Nuxt.js.

## Tecnologías Utilizadas

- [Vue.js 3](https://vuejs.org/) - Framework JavaScript progresivo
- [Nuxt.js 3](https://nuxt.com/) - Framework para Vue.js
- [Bootstrap 5](https://getbootstrap.com/) - Framework CSS
- [Firebase](https://firebase.google.com/) - Backend y base de datos
- [Pinia](https://pinia.vuejs.org/) - Gestión de estado

## Características

- Catálogo de productos
- Autenticación de usuarios
- Carrito de compras
- Proceso de compra
- Chat para soporte
- Diseño responsive

## Requisitos

- Node.js (v14 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd hat-trick-vue
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
FIREBASE_API_KEY=tu-api-key
FIREBASE_AUTH_DOMAIN=tu-auth-domain
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_STORAGE_BUCKET=tu-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
FIREBASE_APP_ID=tu-app-id
FIREBASE_MEASUREMENT_ID=tu-measurement-id
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
hat-trick-vue/
├── components/      # Componentes Vue reutilizables
├── layouts/         # Layouts de la aplicación
├── pages/           # Páginas de la aplicación (rutas)
├── plugins/         # Plugins de Nuxt.js
├── public/          # Archivos estáticos
├── stores/          # Stores de Pinia
├── .env             # Variables de entorno
├── nuxt.config.ts   # Configuración de Nuxt.js
├── package.json     # Dependencias y scripts
└── README.md        # Documentación
```

## Despliegue

Para construir la aplicación para producción:

```bash
npm run build
```

Para previsualizar la versión de producción:

```bash
npm run preview
```

## Migración desde el Proyecto Original

Este proyecto es una migración de un sitio web basado en HTML, CSS y JavaScript puro a un framework moderno (Vue.js/Nuxt.js). Las principales mejoras incluyen:

1. Estructura modular y organizada del código
2. Componentes reutilizables
3. Gestión de estado centralizada con Pinia
4. Mejor rendimiento y experiencia de usuario
5. Rutas y navegación mejoradas
6. Mantenibilidad y escalabilidad del código

## Contacto

Para cualquier consulta, contáctanos en:

- WhatsApp: +573146187857
- Instagram: [@hat_trick_zap](https://www.instagram.com/hat_trick_zap/)
- Facebook: [hat.trick.zapa.colombia](https://www.facebook.com/hat.trick.zapa.colombia)
