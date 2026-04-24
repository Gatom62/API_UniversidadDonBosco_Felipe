import dotenv from "dotenv";

// Ejecutamos la libreria de dotenv
dotenv.config();

// Y con esto podemos mandar a llamar al .env y poder utilizarlo en todo el proyecto
// Es el archivo intermedio que me permite que mi proyecto pueda utilizar las variables de mi .env
export const config = {
  db: {
    URI: process.env.DB_URI,
  },
  JWT: {
    secret: process.env.JWT_SECRET_KEY,
  },
  email: {
    user_email: process.env.USER_EMAIL,
    user_password: process.env.USER_PASSWORD,
  },
};
