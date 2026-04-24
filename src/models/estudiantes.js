import mongoose, { Schema, model } from "mongoose";

// Campos que se utilizaran
/**
 * name
 * lastName
 * email
 * password
 * career // Licenciatura osea carrera
 * isVerified
 * loginAttempts
 * timeOut
 */

const estudiantesSchema = new Schema({
  name: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  career: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
  loginAttempts: {
    type: Number,
  },
  timeOut: {
    type: Date,
  },
});

export default model("Estudiantes", estudiantesSchema);