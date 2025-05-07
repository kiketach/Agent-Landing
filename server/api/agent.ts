import { defineEventHandler, setHeader, getMethod, readBody, createError } from 'h3';

// Asegúrate de que esta URL apunte a tu backend Python desplegado.
// Considera usar variables de entorno para esto.
const PYTHON_AGENT_BACKEND_URL = process.env.PYTHON_AGENT_BACKEND_URL || 'http://localhost:8080'; 

export default defineEventHandler(async (event) => {
  // Agregar headers CORS
  setHeader(event, 'Access-Control-Allow-Origin', process.env.WEB_APP_URL || 'https://grounded-tine-454414-b2.web.app'); // Or your specific frontend URL
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  // Headers para SSE
  setHeader(event, 'Content-Type', 'text/event-stream');
  setHeader(event, 'Cache-Control', 'no-cache');
  setHeader(event, 'Connection', 'keep-alive');

  // Responder a preflight OPTIONS
  if (getMethod(event) === 'OPTIONS') {
    return '';
  }

  if (getMethod(event) !== 'POST') {
    throw createError({ statusCode: 405, message: 'Method Not Allowed' });
  }

  try {
    const body = await readBody(event);
    console.log('Nuxt: Request body to /api/agent:', body);

    const userId = body.user_id;
    const sessionId = body.session_id;
    const messageText = body.message || ''; // El backend Python espera 'message'

    if (!userId || !sessionId || (!messageText && !body.image)) { // Asumimos que un mensaje puede estar vacío si hay una imagen
      throw createError({ statusCode: 400, message: 'user_id, session_id, and message (or image) are required' });
    }

    const requestBody = {
      user_id: body.user_id,
      session_id: body.session_id,
      message: messageText
    };
    // Si tu backend Python maneja imágenes, las pasarías aquí.
    // if (body.image) {
    //   requestBody.image_data = body.image; // O la estructura que espere tu backend
    // }

    console.log('Nuxt: Sending request to Python backend /chat:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${PYTHON_AGENT_BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream', // El backend Python transmitirá SSE
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Nuxt: Python backend /chat response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Nuxt: Error response from Python backend /chat:', errorText);
      throw new Error(`Error from Python agent backend: ${response.status} ${errorText}`);
    }

    // Transmitir la respuesta SSE directamente desde el backend Python al cliente.
    // H3 puede devolver un ReadableStream.
    return response.body;
  } catch (error) {
    console.error('Nuxt: Error in /api/agent handler:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Error desconocido al comunicarse con el agente'
    });
  }
});