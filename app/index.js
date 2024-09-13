import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import express from 'express';
import myconnection from 'express-myconnection';
import mysql from 'mysql';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const secretKey = process.env.SECRET_KEY || 'HolaNoSabesMiClave'; // Debe ser una clave secreta segura

app.set("port", 4000);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Para leer datos POST
app.listen(app.get("port"));
console.log("Servidor corriendo en puerto", app.get("port"));

// MySQL connection
app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'Colmena'
}, 'single'));

app.use(express.static(__dirname + "/Public"));

// Ruta para servir la página de login
app.get("/", (req, res) => res.sendFile(__dirname + "/Login/Login.html"));

// Middleware para verificar el token JWT y deshabilitar caché
function verifyToken(req, res, next) {
    const token = req.cookies.token;

    // Deshabilitar caché en las rutas protegidas
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    if (!token) {
        return res.status(401).redirect('/'); // Redirigir al login si no hay token
    }

    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(400).redirect('/'); // Redirigir al login si el token es inválido
    }
}

// Ruta de login (sin bcrypt)
app.post('/', (req, res) => {
    const { user, password } = req.body;

    // Usar req.getConnection para obtener la conexión a la base de datos
    req.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener la conexión a la base de datos:', err);
            return res.status(500).send('Error de servidor. Inténtalo de nuevo más tarde.');
        }

        // Consulta para obtener el usuario de la base de datos
        connection.query('SELECT * FROM users WHERE user = ?', [user], (err, result) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).send('Error de servidor. Inténtalo de nuevo más tarde.');
            }

            if (result.length > 0) {
                const userFromDB = result[0];

                // Comparar la contraseña ingresada con la almacenada sin bcrypt
                if (password === userFromDB.password) {
                    // Generar el token JWT con el nombre del usuario
                    const token = jwt.sign({ user: userFromDB.user, nombre: userFromDB.nombre }, secretKey, { expiresIn: '1h' });
                    
                    // Almacenar el token JWT en una cookie
                    res.cookie('token', token, { httpOnly: true });
                    
                    // Redirigir a la página del menú después de iniciar sesión
                    res.redirect('/menu');
                } else {
                    res.status(401).send('Contraseña incorrecta');
                }
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        });
    });
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    // Eliminar la cookie del token JWT
    res.clearCookie('token');
    // Deshabilitar caché
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    // Redirigir a la página de inicio de sesión
    res.redirect('/');
});

// Proteger las rutas con el middleware de verificación
app.get("/menu", verifyToken, (req, res) => res.sendFile(__dirname + "/Login/Menu/MenuP.html"));
app.get("/reservaciones", verifyToken, (req, res) => res.sendFile(__dirname + "/Login/Menu/Reserva.html"));
app.get("/inventario", verifyToken, (req, res) => res.sendFile(__dirname + "/Login/Menu/Inventario.html"));
app.get("/usuario", verifyToken, (req, res) => res.sendFile(__dirname + "/Login/Menu/Usuarios.html"));
app.get("/cliente", verifyToken, (req, res) => res.sendFile(__dirname + "/Login/Menu/Clientes.html"));
app.get("/ventas", verifyToken, (req, res) => res.sendFile(__dirname + "/Login/Menu/Ventas.html"));
app.get("/compras", verifyToken, (req, res) => res.sendFile(__dirname + "/Login/Menu/Compras.html"));
app.get("/caja", verifyToken, (req, res) => res.sendFile(__dirname + "/Login/Menu/Caja.html"));
app.get("/incidencias", verifyToken, (req, res) => res.sendFile(__dirname + "/Login/Menu/Incidencias.html"));
app.get("/proveedores", verifyToken, (req, res) => res.sendFile(__dirname + "/Login/Menu/Proveedor.html"));

// Ruta para obtener las ventas desde la base de datos
app.get('/ventas', verifyToken, (req, res) => {
    req.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            return res.status(500).send('Error al obtener la conexión');
        }

        const query = 'SELECT * FROM ventas';
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).send('Error al ejecutar la consulta');
            }

            // Verificar los datos obtenidos de la base de datos
            res.json(results);
        });
    });
});

// Ruta para registrar una nueva venta
app.post('/ventas', (req, res) => {
    const { nro_documento, tipo_documento, fecha_venta, forma_pago, descripcion, estado, total } = req.body;

    req.getConnection((err, connection) => {
        if (err) throw err;

        const query = 'INSERT INTO ventas (nro_documento, tipo_documento, fecha_venta, forma_pago, descripcion, estado, total) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [nro_documento, tipo_documento, fecha_venta, forma_pago, descripcion, estado, total], (err, result) => {
            if (err) throw err;

            res.json({
                nro_documento,
                tipo_documento,
                fecha_venta,
                forma_pago,
                descripcion,
                estado,
                total
            });
        });
    });
});

// Ruta para eliminar una venta
app.delete('/ventas/:nro_documento', (req, res) => {
    const { nro_documento } = req.params;

    req.getConnection((err, connection) => {
        if (err) throw err;

        const query = 'DELETE FROM ventas WHERE nro_documento = ?';
        connection.query(query, [nro_documento], (err, result) => {
            if (err) throw err;

            res.json({ success: true });
        });
    });
});
