// Importamos la libreria mongoose // Osea el orm de mongoose
import mongoose from "mongoose";

// Importamos la variable config para poder acceder a las variables del .env
import { config } from "./config.js";

// Nos conectamos a la bd 😈😈😈
mongoose.connect(config.db.URI);

// connect: una orden especifica
// connection: una orden especifica
// Comprobar que todo funciona
// Creo una constante que es igual a la conexcion
const conecction = mongoose.connection; // Para ver el estado de la conexcion

// once: Una ves
// on: Cuando se ejecute este evento

conecction.once("open", ()=> {
    console.log("DB is conected 😁")
}) //si la conexcion esta habierta, entonces le avisamos al usuario que todo bien

conecction.on("disconnected", ()=>{
    console.log("DB is disconnected")
})

conecction.on("error", (error)=>{
    console.log("error found" + error)  
})