import { createGoogleAuth } from '../../../utils/googleAuth';

export default defineEventHandler(async (event) => {
  try {
    // Obtener datos de la solicitud
    const body = await readBody(event);
    const { projectId, location, resourceId, userId, sessionId, message } = body;

    // Validar parámetros requeridos
    if (!projectId || !location || !resourceId || !userId || !sessionId || !message) {
      return createError({
        statusCode: 400,
        statusMessage: 'Parámetros incompletos. Se requieren todos los campos'
      });
    }

    // Obtener token de autenticación de Google
    const auth = await createGoogleAuth();
    const token = await auth.getAccessToken();

    // Construir la URL de la API de Vertex AI
    const apiUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/reasoningEngines/${resourceId}/sessions/${sessionId}:communicate`;

    // Construir la solicitud
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        query: {
          content: message
        }
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Error en API Vertex:', apiResponse.status, errorText);
      return createError({
        statusCode: apiResponse.status,
        statusMessage: `Error en API Vertex: ${errorText}`
      });
    }

    const responseData = await apiResponse.json();
    
    // Extraer la respuesta del mensaje
    let responseText = '';
    if (responseData.responses && responseData.responses.length > 0) {
      responseText = responseData.responses[0]?.content || '';
    }

    return {
      success: true,
      response: responseText,
      raw: responseData // Devolver también la respuesta completa por si necesitamos más información
    };
  } catch (error) {
    console.error('Error en el endpoint conversation:', error);
    return createError({
      statusCode: 500,
      statusMessage: `Error en el servidor: ${error.message}`
    });
  }
}); 