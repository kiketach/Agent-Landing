import { GoogleAuth } from 'google-auth-library';

/**
 * Crea y devuelve un cliente de autenticación de Google configurado para Vertex AI
 * Utiliza las credenciales predeterminadas de la aplicación (Application Default Credentials)
 */
export const createGoogleAuth = async () => {
  try {
    // Crear cliente de autenticación con ámbito para Vertex AI
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    
    return auth;
  } catch (error) {
    console.error('Error al crear cliente de autenticación Google:', error);
    throw error;
  }
}; 