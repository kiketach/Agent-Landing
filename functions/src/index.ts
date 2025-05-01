import * as functions from 'firebase-functions';
import * as cors from 'cors';
import fetch from 'node-fetch';

const corsHandler = cors({ origin: true });

export const agent = functions.https.onRequest(async (request, response) => {
  // Habilitar CORS
  corsHandler(request, response, async () => {
    try {
      if (request.method !== 'POST') {
        response.status(405).send('Method Not Allowed');
        return;
      }

      const agentResponse = await fetch('https://sales-agent-api-148419107362.us-central1.run.app/deployments/404629075114590208/sessions/9058476628769767424/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(request.body)
      });

      if (!agentResponse.ok) {
        const errorText = await agentResponse.text();
        console.error('Error response:', errorText);
        throw new Error(`Error en la respuesta del agente: ${agentResponse.status} ${errorText}`);
      }

      // Leer la respuesta como texto
      const text = await agentResponse.text();
      console.log('Raw response:', text);

      // Procesar las líneas SSE
      const lines = text.split('\n');
      let lastMessage: any = '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.slice(6); // Remover 'data: '
            const data = JSON.parse(jsonStr);
            lastMessage = data;
          } catch (e) {
            console.error('Error parsing SSE data:', e);
            lastMessage = { message: line.slice(6) };
          }
        }
      }

      response.json(lastMessage);
    } catch (error) {
      console.error('Error detallado:', error);
      response.status(500).json({
        error: error instanceof Error ? error.message : 'Error desconocido al comunicarse con el agente'
      });
    }
  });
}); 