import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey, 
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId
  }

  // Para depuración: verifica que la configuración se esté cargando
  console.log('Firebase config from runtimeConfig:', firebaseConfig);
  if (!firebaseConfig.apiKey) {
    console.error('Firebase API Key is missing. Check your .env and nuxt.config.ts');
  }

  let app;
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      console.log('Firebase App initialized successfully.');
    } catch (error) {
      console.error('Error initializing Firebase app:', error);
      // Si la inicialización falla, no podemos continuar.
      // Proveemos undefined para que el error original en ChatModal siga apareciendo
      // y sepamos que el problema está aquí.
      nuxtApp.provide('firebase', undefined);
      return; 
    }
  } else {
    app = getApp(); // Obtener la app existente si ya fue inicializada
    console.log('Firebase App already initialized. Using existing app.');
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Opcional: Conectar a emuladores de Firebase si los estás usando en desarrollo
  // if (process.env.NODE_ENV === 'development') {
  //   console.log('Connecting to Firebase emulators');
  //   connectAuthEmulator(auth, 'http://localhost:9099');
  //   connectFirestoreEmulator(db, 'http://localhost:8081');
  // }

  console.log('Providing Firebase services to Nuxt app.');
  nuxtApp.provide('firebase', { app, auth, db });
}) 