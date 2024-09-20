//Ejecutar función en el evento click
document.getElementById("btn_open").addEventListener("click", open_close_menu);

//Declaramos variables
var side_menu = document.getElementById("menu_side");
var btn_open = document.getElementById("btn_open");
var body = document.getElementById("body");
var logo = document.getElementById("logo_perfil"); // Variable para el logo

//Evento para mostrar y ocultar menú
function open_close_menu() {
    body.classList.toggle("body_move");
    side_menu.classList.toggle("menu__side_move");

    // Mostrar u ocultar el logo si es necesario
    if (side_menu.classList.contains("menu__side_move")) {
        logo.style.display = "block"; // Mostrar logo cuando el menú se cierra
    } else {
        logo.style.display = "none";  // Ocultar logo cuando el menú se abre
    }
}

//Si el ancho de la página es menor a 760px, ocultará el menú al recargar la página
if (window.innerWidth < 760) {
    body.classList.add("body_move");
    side_menu.classList.add("menu__side_move");
}

//Haciendo el menú responsive(adaptable)
window.addEventListener("resize", function() {
    if (window.innerWidth > 760) {
        body.classList.remove("body_move");
        side_menu.classList.remove("menu__side_move");
        logo.style.display = "block"; // Mostrar logo en pantallas grandes
    }

    if (window.innerWidth < 760) {
        body.classList.add("body_move");
        side_menu.classList.add("menu__side_move");
        logo.style.display = "block"; // Mostrar logo en pantallas pequeñas
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('token');
    console.log("Token obtenido:", token);

    if (token) {
        try {
            const decoded = jwt_decode(token);
            console.log("Token decodificado:", decoded);
            const nombreUsuario = decoded.nombre;
            console.log("Nombre del usuario:", nombreUsuario);

            const nombreUsuarioElement = document.getElementById('nombreUsuario');
            if (nombreUsuarioElement) {
                nombreUsuarioElement.textContent = `Bienvenido, ${nombreUsuario}`;
            } else {
                console.error("Elemento con id 'nombreUsuario' no encontrado en el DOM.");
            }
        } catch (error) {
            console.error("Error al decodificar el token:", error);
        }
    } else {
        console.warn("No se encontró el token JWT en las cookies.");
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
