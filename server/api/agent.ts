import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log('Request body:', body);

    // Construir el mensaje base
    let messageText = body.message || '';
    
    // Si hay una imagen, agregar la URL al final del mensaje
    if (body.image) {
      messageText += '\n[Imagen adjunta]';
    }

    const requestBody = {
      user_id: body.user_id,
      session_id: body.session_id,
      message: messageText
    };

    console.log('Sending request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://sales-agent-api-148419107362.us-central1.run.app/deployments/404629075114590208/sessions/9058476628769767424/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error en la respuesta del agente: ${response.status} ${errorText}`);
    }

    // Leer la respuesta como texto
    const text = await response.text();
    console.log('Raw response:', text);

    // Procesar las líneas SSE
    const lines = text.split('\n');
    let lastMessage: any = null;
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const jsonStr = line.slice(6); // Remover 'data: '
          // Intentar parsear directamente
          try {
            const data = JSON.parse(jsonStr);
            lastMessage = data;
          } catch {
            // Si falla, intentar reemplazar las comillas simples por dobles
            const fixedJsonStr = jsonStr
              .replace(/'/g, '"')
              .replace(/\\n/g, '\\n');
            lastMessage = JSON.parse(fixedJsonStr);
          }
        } catch (e) {
          console.error('Error parsing SSE data:', e);
          // Si no es JSON válido, usar el texto como mensaje
          lastMessage = { message: line.slice(6) };
        }
      }
    }

    // Si no se encontró ningún mensaje, devolver error
    if (!lastMessage) {
      throw new Error('No se pudo procesar la respuesta del agente');
    }

    // Si lastMessage es un objeto con la estructura esperada, devolverlo como está
    if (typeof lastMessage === 'object' && lastMessage.content?.parts?.[0]?.text) {
      return { message: lastMessage };
    }

    // Si es una cadena, envolverla en un objeto
    if (typeof lastMessage === 'string') {
      return { message: lastMessage };
    }

    // En cualquier otro caso, devolver el objeto completo
    return { message: lastMessage };
  } catch (error) {
    console.error('Error detallado:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Error desconocido al comunicarse con el agente'
    });
  }
}); 