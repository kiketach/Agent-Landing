import { createGoogleAuth } from '../../../utils/googleAuth';

export default defineEventHandler(async (event) => {
  try {
    // Obtener datos de la solicitud
    const body = await readBody(event);
    const { projectId, location, resourceId, userId } = body;

    // Validar parámetros requeridos
    if (!projectId || !location || !resourceId || !userId) {
      return createError({
        statusCode: 400,
        statusMessage: 'Parámetros incompletos. Se requiere projectId, location, resourceId y userId'
      });
    }

    // Obtener token de autenticación de Google
    const auth = await createGoogleAuth();
    const token = await auth.getAccessToken();

    // Construir la URL de la API de Vertex AI para crear sesión
    const apiUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/reasoningEngines/${resourceId}/sessions`;

    // Construir la solicitud
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId
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
    
    // Extraer el ID de la sesión de la respuesta
    // El formato esperado es "projects/PROJECT/locations/LOCATION/reasoningEngines/RESOURCE_ID/sessions/SESSION_ID"
    const sessionPath = responseData.name || '';
    const sessionId = sessionPath.split('/').pop();
    
    if (!sessionId) {
      return createError({
        statusCode: 500,
        statusMessage: 'No se pudo obtener el ID de sesión'
      });
    }
    
    return {
      success: true,
      sessionId,
      userId,
      projectId,
      location,
      resourceId,
      raw: responseData
    };
  } catch (error) {
    console.error('Error en el endpoint session:', error);
    return createError({
      statusCode: 500,
      statusMessage: `Error en el servidor: ${error.message}`
    });
  }
}); 