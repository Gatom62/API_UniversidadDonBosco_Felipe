import jsonwebtoken from "jsonwebtoken"; //Crear token
import bcrypt from "bcryptjs"; // Encriptar
import crypto, { verify } from "crypto"; // Para generar codigo aleatorio
import nodemailer from "nodemailer";

import { config } from "../../config.js";

import estudiantesModel from "../models/estudiantes.js";

// HTML para enviarlo por correo
import { HTMLRecoveryEmail } from "../utils/sendMailRecovery.js";

const recoveryPasswordController = {};

// Para enviar el codigo de verificación por correo
recoveryPasswordController.requestCode = async (req, res) => {
  try {
    // Solicitamos los datos
    const { email } = req.body;

    // Validamos el correo si esta en la bd
    const userFound = await estudiantesModel.findOne({ email });

    // Si no existe
    if (!userFound) {
      return res.json({ message: "Usuario no encontrado" });
    }

    // Si existe, generamos codigo aleatorio
    const code = crypto.randomBytes(3).toString("hex");

    // Guardamos todo en un token
    const token = jsonwebtoken.sign(
      // Que vamos a guardar
      { email, code, userType: "customer", verified: false },
      // Secret key
      config.JWT.secret,
      // Cuando expira
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", token, { maxAge: 15 * 60 * 1000 });

    // Enviar correo eléctronico
    // # Quien lo envia
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    // Quien lo recibe
    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Correo de recuperación",
      body: "Use this code to recover ur account",
      html: HTMLRecoveryEmail(code),
    };

    // Enviar el correo y responder al cliente
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Error sending mail" });
      }

      return res.status(200).json({ message: "email sent", success: true });
    });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Verificar el codigo
recoveryPasswordController.verifyCode = async (req, res) => {
  try {
    // Solicitar los datos
    const { codeRequest } = req.body;

    // Obtenemos la informacion que esta dentro del token
    // Accedo al token que esta dentro de la cookie
    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    //Comparar lo que el usuario escribio, con lo que se esta en el token
    if (decoded.code !== codeRequest) {
      return res.status(400).json({ message: "Invalid code" });
    }

    // Si lo escribe bien, vamos a colocarlo en el token
    const newToken = jsonwebtoken.sign(
      // Que vamos a guardar
      { email: decoded.email, userType: "customer", verified: true },
      // Secret key
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });

    return res.status(200).json({ message: "Code verified successfully" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

recoveryPasswordController.newPassword = async (req, res) => {
  try {
    // Solicitar los datos
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords doesnt match" });
    }

    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    // Encriptamos la contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Actualizamos la contraseña
    await estudiantesModel.findOneAndUpdate(
      { email: decoded.email },
      { password: passwordHash },
      { new: true },
    );

    // Limpiamos la cookie
    res.clearCookie("recoveryCookie");

    // Respondemos
    return res.status(200).json({ message: "Password update" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default recoveryPasswordController;
