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

- Node.js
- npm

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/kiketach/Agent-Landing.git
cd MVP-Vue
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

La aplicación estará disponible en [http://localhost:3000]

## Estructura del Proyecto

```
MVP-Vue/
├── .firebase/       # Configuración y herramientas para el despliegue en Firebase
├── components/      # Componentes Vue reutilizables
├── functions/         # Código backend para la integración con Firebase y manejo de funciones
│   ├── src/           # Código fuente de las funciones
│   │   └── index.ts   # Punto de entrada principal para las funciones
│   └── package.json   # Dependencias de las funciones
├── layouts/         # Layouts de la aplicación
├── pages/           # Páginas de la aplicación (rutas)
├── plugins/         # Plugins de Nuxt.js
├── public/          # Archivos estáticos
── server/            # Lógica backend para manejar integraciones y servicios externos
│   ├── api/           # Endpoints API para la aplicación
│   │   └── agent.ts   # Endpoint para la integración con el agente en Google Cloud Run
│   ├── tsconfig.json  # Configuración de TypeScript para el servidor
├── stores/          # Stores de Pinia
├── .env             # Variables de entorno
├── nuxt.config.ts   # Configuración de Nuxt.js
├── package.json     # Dependencias y scripts
└── README.md        # Documentación
```

## Funciones Backend
Descripción
La carpeta functions contiene el código backend que se ejecuta en Firebase Functions. Estas funciones son responsables de manejar tareas críticas como el manejo de solicitudes, la integración con servicios externos y la lógica del negocio.

## Lógica del Servidor
La carpeta server contiene la lógica backend del proyecto, que incluye la comunicación con el agente en Google Cloud Run y otros servicios externos. El archivo agent.ts define un endpoint para conectarse al agente en Google Cloud Run.
El endpoint utiliza Server-Sent Events (SSE) para comunicación en tiempo real.
tsconfig.json extiende la configuración de Nuxt para facilitar el desarrollo backend.
 
## Despliegue

# Despliegue en Firebase
Requisitos
Asegúrate de tener instalado Firebase CLI:

bash
npm install -g firebase-tools

# Pasos para el Despliegue
Configura Firebase en tu máquina local:

bash
firebase login
firebase init

# Realiza el despliegue:

bash
firebase deploy

# Notas
La configuración para Firebase se encuentra en la carpeta .firebase.
Asegúrate de tener las credenciales correctas para tu proyecto en Firebase.


## Nueva Sección: Integración con el Agente
# Descripción
El proyecto incluye una integración con un agente inteligente que maneja eventos y solicitudes relacionadas con el negocio. Este agente está alojado en Google Cloud Run y utiliza Server-Sent Events (SSE) para comunicación en tiempo real. Adicionalmente, el manejo inicial se realiza desde un servidor local configurado con Nuxt.js.

# Características del Agente
Alojamiento en Google Cloud Run: Permite escalabilidad y confiabilidad.
Manejo de SSE: Comunicación eficiente y en tiempo real entre cliente y servidor.
Servicio local: Un servidor local maneja las solicitudes y la construcción de mensajes para el agente.
Implementación de la Comunicación con el Agente
El servidor local utiliza un handler configurado con Nuxt.js, que realiza las siguientes operaciones:

# Configuración de CORS: Permite solicitudes desde dominios específicos.
Manejo de solicitudes OPTIONS: Responde a preflight requests.
Construcción de mensajes: Combina texto e imágenes en el cuerpo de la solicitud.
Envío al agente: Realiza la solicitud al endpoint del agente alojado en Google Cloud Run.
Procesamiento de respuestas SSE: Procesa mensajes en formato JSON provenientes del agente.

# Cómo configurar y usar la integración
Configuración del servidor local:

# Define las cabeceras CORS para permitir solicitudes desde tu dominio.
Maneja solicitudes OPTIONS para preflight requests.
Procesa los mensajes provenientes del cliente antes de enviarlos al agente.
Endpoint del agente en Google Cloud Run:

# URL del endpoint: https://<tu-endpoint-cloud-run>
Método: POST
Headers requeridos:
Content-Type: application/json
Accept: text/event-stream

# Beneficios
- Escalabilidad: Gracias al uso de Google Cloud Run.
- Tiempo real: SSE permite respuestas rápidas y actualizaciones dinámicas.
- Conocimiento del negocio: El agente comprende los procesos críticos de la tienda.

## Demo en Vivo

Puedes ver una demostración del proyecto desplegado aquí: [https://grounded-tine-454414-b2.web.app](https://grounded-tine-454414-b2.web.app)


## Contacto

Para cualquier consulta, contáctanos en:
- Linkedin: (https://www.linkedin.com/in/enrique-abril-contreras/)
