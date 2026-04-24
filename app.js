// Importamos la libreria de express
import express from "express";

// Enpoints que mandan correo para verificar contraseña
// import registerCustomer from "./src/routes/registerCostumer.js";

// Para utilizar cookies
import cookieParser from "cookie-parser";

// Para recuperar contraseña
// import recoveryPasswors from "./src/routes/recoveryPassword.js";

// Una constante que ejecuta la libreria express
const app = express();

app.use(cookieParser());

// Asepte json desde postman
app.use(express.json());

// Creamos los enpoints
// app.use("/api/products", productsRoutes);

// Ahora lo exportamos por default
export default app;
