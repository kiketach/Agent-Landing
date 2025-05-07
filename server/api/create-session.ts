// c:\Users\Audisoft\Documents\Proyectos\MVP\MVP-Vue\server\api\create-session.ts
import { defineEventHandler, readBody, createError } from 'h3';

// Asegúrate de que esta URL apunte a tu backend Python desplegado.
// Considera usar variables de entorno para esto.
const PYTHON_AGENT_BACKEND_URL = process.env.PYTHON_AGENT_BACKEND_URL || 'http://localhost:8080'; 

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({ statusCode: 405, message: 'Method Not Allowed' });
  }

  try {
    const body = await readBody(event);
    const userId = body.user_id;

    if (!userId) {
      throw createError({ statusCode: 400, message: 'user_id is required' });
    }

    console.log(`Nuxt: Creating session for user_id: ${userId} via Python backend`);
    const response = await fetch(`${PYTHON_AGENT_BACKEND_URL}/create_session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Nuxt: Error creating session via Python backend:', errorText);
      throw new Error(`Failed to create session with agent service: ${response.status} ${errorText}`);
    }
    // Devolver directamente la respuesta JSON del backend Python que contiene { session_id: "..." }
    return await response.json();
  } catch (error) {
    console.error('Nuxt: Error in /api/create-session handler:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Unknown error creating session',
    });
  }
});