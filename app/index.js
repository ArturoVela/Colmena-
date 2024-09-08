import express from "express";
import cookieParser from 'cookie-parser';
//Fix para __direname
import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));




//Server
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("Servidor corriendo en puerto",app.get("port"));


//Configuración
app.use(express.static(__dirname + "/Public"));
app.use(express.json());
app.use(cookieParser())

//rutas
app.get("/",(req,res)=> res.sendfile(__dirname + "/Login/Login.html"));
app.get("/recuperar",(req,res)=> res.sendfile(__dirname + "/Login/OlvidasteContraseña.html"));
app.get("/menu",(req,res)=> res.sendfile(__dirname + "/Login/Menu/MenuP.html"));
app.get("/reservaciones",(req,res)=> res.sendfile(__dirname + "/Login/Menu/Reserva.html"));
app.get("/inventario",(req,res)=> res.sendfile(__dirname + "/Login/Menu/Inventario.html"));
app.get("/usuario",(req,res)=> res.sendfile(__dirname + "/Login/Menu/Usuarios.html"));
app.get("/cliente",(req,res)=> res.sendfile(__dirname + "/Login/Menu/Clientes.html"));
app.get("/ventas",(req,res)=> res.sendfile(__dirname + "/Login/Menu/Ventas.html"));
app.get("/compras",(req,res)=> res.sendfile(__dirname + "/Login/Menu/Compras.html"));
app.get("/caja",(req,res)=> res.sendfile(__dirname + "/Login/Menu/Caja.html"));
app.get("/incidencias",(req,res)=> res.sendfile(__dirname + "/Login/Menu/Incidencias.html"));


console.log(__dirname);
