// para encriptar
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

// Importamos el modelo
import docentesModel from "../models/docentes.js";

import { config } from "../../config.js";

// Array de funciones
const loginDocenteController = {};

// Funcion para login
loginDocenteController.login = async (req, res) => {
  try {
    // Solicitamos los datos
    const { email, password } = req.body;

    // Varificar que existe el correo en la base de datos
    const userFound = await docentesModel.findOne({ email }); // Va a buscar 1 en base al correo electronico que haya ingresado el usuario

    // Por si no lo encuntra
    if (!userFound) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Verificar que no este bloqueado
    if (userFound.timeOut && userFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    // Validamos la contraseña
    const isMach = await bcrypt.compare(password, userFound.password);

    // Validamos los intentos fallidos
    if (!isMach) {
      // Si se equivoca en la contraseña
      // Vamos a sumarle a 1 a los intentos fallidos
      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

      // Bloquear la cuenta despues de 5 intentos fallidos
      if (userFound.loginAttempts >= 5) {
        //Minutos, segundos, milisegun
        userFound.timeOut = Date.now() + 15 * 60 * 1000;
        userFound.loginAttempts = 0;
        await userFound.save();
        // Mensaje de que sele bloqueo la cuenta
        return res.status(403).json({ message: "Account blocked" });
      }

      await userFound.save();
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Si escribe la contraseña bien, hay que borrar los intentos fallidos anteriores
    userFound.loginAttempts = 0; // Intentos fallidos
    userFound.timeOut = null; // Tiempo de espera para que se nos quite el bloqueo
    await userFound.save();

    // Generamos la cookie
    const token = jsonwebtoken.sign(
      // Que vamos a guardar
      {
        id: userFound._id,
        userType: "customer",
      },
      // Secreta
      config.JWT.secret,

      // Cuando expira
      { expiresIn: "30d" },
    );

    // Guardamos el token en una cokie
    res.cookie("authCookie", token);

    // Retornamos el token
    return res.status(200).json({ message: "Successful login" });
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// Exportamos
export default loginDocenteController;