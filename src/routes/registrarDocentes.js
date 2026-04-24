import express from "express";
import registerDocentesController from "../controllers/controladorRegistrarDocentes.js";

const router = express.Router();

router.route("/").post(registerDocentesController.register);
router.route("/verifyCodeEmail").post(registerDocentesController.verifyCode);

export default router;
