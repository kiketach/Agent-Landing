// Services/vertexAgent.js
// Servicio para comunicarse con Vertex AI Agent vía API REST

// Configuración por defecto para el agente
const defaultConfig = {
  projectId: 'grounded-tine-454414-b2',
  location: 'us-central1',
  resourceId: '404629075114590208',
  userId: 'test_user',
  sessionId: '9058476628769767424'
};

/**
 * Servicio para interactuar con el agente de Vertex AI
 */
export default {
  /**
   * Envía un mensaje al agente y retorna la respuesta
   * @param {string} message - Mensaje a enviar al agente
   * @param {Object} config - Configuración opcional (projectId, location, resourceId, userId, sessionId)
   * @returns {Promise<string>} - Respuesta del agente
   */
  async sendMessage(message, config = {}) {
    try {
      // Combinar configuración predeterminada con la proporcionada
      const finalConfig = {
        ...defaultConfig,
        ...config
      };

      const { projectId, location, resourceId, userId, sessionId } = finalConfig;

      // Llamar al API REST para enviar mensaje
      const response = await fetch(`/api/vertex/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          location,
          resourceId,
          userId,
          sessionId,
          message
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la respuesta del agente: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error al enviar mensaje al agente:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva sesión para un usuario
   * @param {string} userId - ID del usuario para la sesión
   * @param {Object} config - Configuración opcional (projectId, location, resourceId)
   * @returns {Promise<Object>} - Datos de la sesión creada
   */
  async createSession(userId, config = {}) {
    try {
      // Combinar configuración predeterminada con la proporcionada
      const finalConfig = {
        ...defaultConfig,
        ...config
      };

      const { projectId, location, resourceId } = finalConfig;

      // Llamar al API REST para crear sesión
      const response = await fetch(`/api/vertex/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          location,
          resourceId,
          userId
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al crear sesión: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear sesión con el agente:', error);
      throw error;
    }
  }
}; 