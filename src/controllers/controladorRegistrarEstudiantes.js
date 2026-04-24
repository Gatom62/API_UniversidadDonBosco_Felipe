/**
 * nodemailer // Enviar correos con SMTP
 * crypto // Generar codigo aleatorio
 * jsonwebtoken //Generar token
 * bcryptjs // Encriptar contraseña
 */
import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcrypjs from "bcryptjs";

import estudiantesModel from "../models/estudiantes.js";
import { config } from "../../config.js";

// Creo un array de funciones
const registrarEstudiantesController = {};

// Enpoint para registrar el usuario y luego mandarle el codigo de verificacion por correo
registrarEstudiantesController.register = async (req, res) => {
  // Solicitar los datos a guardar
  const {
    name,
    lastName,
    email,
    password,
    career,
    isVerified,
    loginAttempts,
    timeOut,
  } = req.body;

  try {
    // Varicar si el cliente ya existe
    const existeEstudiante = await estudiantesModel.findOne({ email });
    if (existeEstudiante) {
      return res.status(400).json({ message: "Estudiante ya registrado" });
    }

    // Encrytamos la contraseña
    const passwordHash = await bcrypjs.hash(password, 10); // el 10 es por que definimos cuantas veces se va a repetir este proceso

    // Guardamos todo en la base de datos
    const nuevoEstudiante = await estudiantesModel({
      name,
      lastName,
      email,
      password: passwordHash,
      career,
      isVerified: false,
      loginAttempts,
      timeOut,
    });

    // Guardamos todo en la base datos
    await nuevoEstudiante.save();

    // Enviamos un codigo de verificacion, para verifiar si el usuario es dueño de ese correo
    const verificationCode = crypto.randomBytes(3).toString("hex"); // hex: Exadecimal y al final sera 3 numeros y 3 letras

    // Generamos un token para guardar el codigo aleatorio
    const tokenCode = jsonwebtoken.sign(
      // Que vamos a guardar?
      { email, verificationCode },
      // Secret key
      config.JWT.secret,
      // Tiempo de expiracion
      { expiresIn: "15m" },
    );

    // Y el token lo guardamos dentro de una cookie
    // Name cookie
    res.cookie("verificationToken", tokenCode, { maxAge: 15 * 60 * 60 * 1000 });

    // Enviar ese codigo por correo
    // Transporter -> quien envia el correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    // mailOptions -: quien lo va a recibir
    // A qui le podemos mandar un html
    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Verificacion de cuenta",
      text:
        "Para verificar tu cuenta, utiliza este codigo " +
        verificationCode +
        " expira en 15 min",
    };

    // Enviamos el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "error" });
      }

      res.status(200).json({ message: "Estudiante registrado, Verifica tu cuenta" });
    });
  } catch (error) {
    console.log("error:" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Verificar el codigo que le acabamos de enviar
registrarEstudiantesController.verifyCode = async (req, res) => {
  try {
    // Solicitamos el codigo que escribieron en el frontEnd
    const { varificationCodeRequest } = req.body;

    // Optener el token de las cookies
    const token = req.cookies.verificationToken;

    // Ver que codigo esta en el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    const { email, verificationCode: storedCode } = decoded;

    // Comparar el codigo que el usuario escribe
    // Con el codigo que esta en el token
    if (varificationCodeRequest !== storedCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    //Si el codigo esta bien, entonces, colocamos el campo
    //"isVerified" en true
    const estudiante = await estudiantesModel.findOne({ email });
    estudiante.isVerified = true;
    await estudiante.save();

    // Limpiamos la cookie
    res.clearCookie("verificationToken");

    res.json({ message: "Email verified succesfully" });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default registrarEstudiantesController;
