document.addEventListener('DOMContentLoaded', () => {
    const inputBuscar = document.getElementById('buscar');
    const tablaUsers = document.getElementById('tabla-users');
    const popup = document.getElementById('popup');
    const popupInfo = document.getElementById('popup-info');
    const closeBtn = document.querySelector('.close-btn');

    // Función para cargar los datos desde el servidor
    const cargarDatos = () => {
        fetch('/users')
            .then(response => response.json())
            .then(data => {
                mostrarDatos(data);
                inputBuscar.addEventListener('input', () => filtrarDatos(data));
            });
    };

    // Función para mostrar los datos en la tabla
    const mostrarDatos = (data) => {
        tablaUsers.innerHTML = '';
        data.forEach(user => {
            const estado = user.estado === 1 ? 'ACTIVO' : 'INACTIVO';
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.apellido}</td>
                <td>${user.usuario}</td>
                <td>${user.rol}</td>
                <td class="status ${estado.toLowerCase()}">${estado}</td>
                <td>
                    <button class="action-btn show-btn" data-id="${user.id}"><i class='bx bx-show'></i></button>
                    <button class="action-btn"><i class='bx bx-edit-alt'></i></button>
                    <button class="action-btn"><i class='bx bx-trash'></i></button>
                </td>
            `;
            tablaUsers.appendChild(fila);
        });

        // Agregar eventos a los botones de mostrar
        document.querySelectorAll('.show-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const userId = event.currentTarget.getAttribute('data-id');
                const user = data.find(u => u.id == userId);
                mostrarPopup(user);
            });
        });
    };

    // Función para mostrar el popup con la información del usuario
    const mostrarPopup = (user) => {
        popupInfo.innerHTML = `
            <p>ID: ${user.id}</p>
            <p>Nombre: ${user.nombre}</p>
            <p>Apellido: ${user.apellido}</p>
            <p>Usuario: ${user.usuario}</p>
            <p>Rol: ${user.rol}</p>
            <p>Estado: ${user.estado === 1 ? 'ACTIVO' : 'INACTIVO'}</p>
        `;
        popup.classList.remove('hidden');
        popup.style.display = 'block';
    };

    // Función para cerrar el popup
    const cerrarPopup = () => {
        popup.classList.add('hidden');
        popup.style.display = 'none';
    };

    // Cerrar el popup cuando se hace clic en el botón de cerrar
    closeBtn.addEventListener('click', cerrarPopup);

    // Cerrar el popup cuando se hace clic fuera del contenido del popup
    window.addEventListener('click', (event) => {
        if (event.target == popup) {
            cerrarPopup();
        }
    });

    // Función para filtrar los datos según el término de búsqueda
    const filtrarDatos = (data) => {
        const termino = inputBuscar.value.toLowerCase();
        const datosFiltrados = data.filter(user => 
            user.nombre.toLowerCase().includes(termino) ||
            user.apellido.toLowerCase().includes(termino) ||
            user.usuario.toLowerCase().includes(termino) ||
            user.dni.toLowerCase().includes(termino) ||
            user.rol.toLowerCase().includes(termino) ||
            (user.estado === 1 ? 'activo' : 'inactivo').includes(termino)
        );
        mostrarDatos(datosFiltrados);
    };

    // Cargar los datos al iniciar
    cargarDatos();
});
