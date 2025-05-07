const functions = require("firebase-functions");
const cors = require("cors")({ origin: true }); // Permite cualquier origen

// Importa dinámicamente el punto de entrada del servidor Nuxt.
// La ruta es relativa desde la carpeta 'functions' a la carpeta '.output'.
const serverPromise = import("../.output/server/index.mjs");

exports.server = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const { default: server } = await serverPromise;
    server(request, response);
  });
});