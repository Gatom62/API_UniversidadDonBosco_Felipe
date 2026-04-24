// Importamos la libreria de express
import express from "express";

// Enpoints que mandan correo para verificar contraseña
// import registerCustomer from "./src/routes/registerCostumer.js";

// Para utilizar cookies
import cookieParser from "cookie-parser";

// Para recuperar contraseña
// import recoveryPasswors from "./src/routes/recoveryPassword.js";
import registrarEstudiantes from "./src/routes/registrarEstudiantes.js";
import registrarDocentes from "./src/routes/registrarDocentes.js";
import loginEstudiantes from "./src/routes/loguinEstudiantes.js";
import loginDocentes from "./src/routes/loginDocentes.js";
import recuperarContraseñaEstudiantes from "./src/routes/recuperarContraseñaEstudiantes.js";
import recuperarContraseñaDocentes from "./src/routes/recuperarContraseñaDocentes.js";

// Una constante que ejecuta la libreria express
const app = express();

app.use(cookieParser());

// Asepte json desde postman
app.use(express.json());

// Creamos los enpoints
// app.use("/api/products", productsRoutes);
app.use("/api/registrarEstudiantes", registrarEstudiantes);
app.use("/api/registrarDocentes", registrarDocentes);
app.use("/api/loginEstudiantes", loginEstudiantes);
app.use("/api/loginDocentes", loginDocentes);
app.use("/api/recuperarContraseñaEstudiantes", recuperarContraseñaEstudiantes);
app.use("/api/recuperarContraseñaDocentes", recuperarContraseñaDocentes);

// Ahora lo exportamos por default
export default app;
