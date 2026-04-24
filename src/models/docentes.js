import mongoose, { Schema, model } from "mongoose";

// Campos que se utilizaran
/**
 * name
 * lastName
 * email
 * password
 * isActive
 * isVerified
 * loginAttempts
 * timeOut
 */

const docentesSchema = new Schema({
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
  isActive: {
    type: Boolean,
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

export default model("Docentes", docentesSchema)