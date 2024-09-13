//import express from "express";
import cookieParser from 'cookie-parser';


import express from 'express';
import { engine } from 'express-handlebars';
import myconnection from 'express-myconnection';
import bodyParser from 'body-parser';
import mysql from 'mysql';


//Fix para __direname
import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));




//Server
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("Servidor corriendo en puerto",app.get("port"));

//SQL
app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'Colmena'
  }, 'single'));



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
app.get("/proveedores",(req,res)=> res.sendfile(__dirname + "/Login/Menu/Proveedor.html"));


console.log(__dirname);
