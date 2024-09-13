// Obtener el modal y los botones
var modal = document.getElementById("modalVentas");
var btnAbrir = document.getElementById("abrirModal");
var btnCerrar = document.querySelector(".close-btn");
var formRegistroVenta = document.getElementById("registroVentaForm");
var tablaVentas = document.querySelector("tbody");

// Abrir el modal cuando se haga clic en el botón "Nuevo"
btnAbrir.onclick = function() {
    modal.style.display = "block";
}

// Cerrar el modal cuando se haga clic en el botón de cierre
btnCerrar.onclick = function() {
    modal.style.display = "none";
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Función para eliminar una fila de la tabla
function agregarEventoEliminar(btnEliminar, nroDocumento, fila) {
    btnEliminar.addEventListener('click', function() {
        // Confirmación de eliminación
        if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
            // Eliminar la fila del DOM
            fila.remove();

            // Enviar la solicitud DELETE al servidor
            fetch(`/ventas/${nroDocumento}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Venta eliminada correctamente');
                } else {
                    console.error('Error al eliminar la venta en la base de datos');
                }
            })
            .catch(error => console.error('Error al eliminar la venta:', error));
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el token JWT de las cookies
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    
    if (tokenCookie) {
        const token = tokenCookie.split('=')[1];

        if (token) {
            try {
                // Decodificar el token JWT para obtener el nombre del usuario
                const decodedToken = jwt_decode(token);
                const nombreUsuario = decodedToken.nombre;

                // Mostrar el nombre del usuario en la parte superior derecha
                document.getElementById('nombreUsuario').textContent = `Hola, ${nombreUsuario}`;
            } catch (error) {
                console.error("Error al decodificar el token JWT:", error);
            }
        }
    } else {
        console.error("No se encontró el token JWT en las cookies.");
    }

    // Cargar las ventas desde la base de datos cuando la página se cargue
    fetch('/ventas') // Ruta para obtener las ventas desde el servidor
    .then(response => response.json())
    .then(data => {
        const tablaVentas = document.querySelector("tbody");

        // Recorrer los datos obtenidos y generar las filas de la tabla
        data.forEach(venta => {
            var nuevaFila = `
                <tr>
                    <td><a href="#">${venta.nro_documento}</a></td>
                    <td>${venta.tipo_documento}</td>
                    <td>${venta.fecha_venta}</td>
                    <td>${venta.forma_pago}</td>
                    <td>${venta.descripcion}</td>
                    <td class="${venta.estado === 'exitosa' ? 'green' : 'red'}">${venta.estado}</td>
                    <td>${venta.total}</td>
                    <td>
                        <button class="action-btn">Ver</button>
                        <button class="action-btn">Editar</button>
                        <button class="action-btn eliminar-btn">Eliminar</button>
                    </td>
                </tr>
            `;
            tablaVentas.insertAdjacentHTML('beforeend', nuevaFila);

            // Agregar evento para eliminar a cada nueva fila cargada desde la base de datos
            var btnEliminar = tablaVentas.lastElementChild.querySelector('.eliminar-btn');
            agregarEventoEliminar(btnEliminar, venta.nro_documento, tablaVentas.lastElementChild);
        });
    })
    .catch(error => console.error('Error al cargar las ventas:', error));
});

// Registrar venta y actualizar la tabla sin recargar la página
formRegistroVenta.onsubmit = function(event) {
    event.preventDefault(); // Evitar el envío del formulario normal

    // Obtener los datos del formulario
    var formData = new FormData(formRegistroVenta);
    
    // Crear un objeto con los datos para enviar al servidor
    var ventaData = {
        nro_documento: formData.get('nro_documento'),
        tipo_documento: formData.get('tipo_documento'),
        fecha_venta: formData.get('fecha_venta'),
        forma_pago: formData.get('forma_pago'),
        descripcion: formData.get('descripcion'),
        estado: formData.get('estado'),
        total: formData.get('total')
    };

    // Enviar los datos al servidor usando Fetch API (POST request)
    fetch('/ventas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaData)
    })
    .then(response => response.json())
    .then(data => {
        // Cerrar el modal
        modal.style.display = "none";

        // Crear la nueva fila para la venta
        var nuevaFila = document.createElement('tr');

        nuevaFila.innerHTML = `
            <td><a href="#">${data.nro_documento}</a></td>
            <td>${data.tipo_documento}</td>
            <td>${data.fecha_venta}</td>
            <td>${data.forma_pago}</td>
            <td>${data.descripcion}</td>
            <td class="${data.estado === 'exitosa' ? 'green' : 'red'}">${data.estado}</td>
            <td>${data.total}</td>
            <td>
                <button class="action-btn">Ver</button>
                <button class="action-btn">Editar</button>
                <button class="action-btn eliminar-btn">Eliminar</button>
            </td>
        `;

        // Agregar la nueva fila a la tabla
        tablaVentas.appendChild(nuevaFila);

        // Obtener el botón "Eliminar" de la nueva fila y agregar el evento
        var btnEliminar = nuevaFila.querySelector('.eliminar-btn');
        agregarEventoEliminar(btnEliminar, data.nro_documento, nuevaFila);

    })
    .catch(error => console.error('Error al registrar la venta:', error));
}
