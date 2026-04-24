import express from "express"
import loginDocenteController from "../controllers/controladorLoginDocentes.js"

const router = express.Router();

// Con pleca significa que el enpoit solo va a mandar datos y recibir para funcionar
router.route("/").post(loginDocenteController.login);

export default router;