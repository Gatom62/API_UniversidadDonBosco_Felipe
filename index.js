// Importamos la constante de app para poder ejecutar express en el momento que se ejecute el proyecto 😈😈😈
import app from "./app.js";
import "./database.js"

// Crep la funcion
// Que se encarga de ejecutar el servidor
async function main() {
  app.listen(4000); // Ejecutamos app en el puerto 4000
  console.log("Server on port 4000 <:")
}

// Ejecutamos main
main();