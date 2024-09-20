document.addEventListener('DOMContentLoaded', function () {
    const btnOpen = document.getElementById('btn_open');
    const menuSide = document.getElementById('menu_side');
    const body = document.getElementById('body');

    // Toggle menu visibility
    btnOpen.addEventListener('click', function () {
        menuSide.classList.toggle('active');
        body.classList.toggle('body-pd');
    });

    // Example data for the table
    const users = [
        { id: 1, nombres: 'Juan', apellidos: 'Pérez', usuario: 'jperez', rol: 'Admin', estado: 'Activo' },
        { id: 2, nombres: 'María', apellidos: 'Gómez', usuario: 'mgomez', rol: 'Usuario', estado: 'Inactivo' }
    ];

    // Function to render users in the table
    function renderUsers(users) {
        const tableBody = document.getElementById('tabla-users');
        tableBody.innerHTML = ''; // Clear existing rows

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nombres}</td>
                <td>${user.apellidos}</td>
                <td>${user.usuario}</td>
                <td>${user.id}</td>
                <td>${user.rol}</td>
                <td>${user.estado}</td>
                <td>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Initial render
    renderUsers(users);

    // Search functionality
    const searchInput = document.getElementById('buscar');
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredUsers = users.filter(user => 
            user.nombres.toLowerCase().includes(searchTerm) ||
            user.apellidos.toLowerCase().includes(searchTerm) ||
            user.usuario.toLowerCase().includes(searchTerm)
        );
        renderUsers(filteredUsers);
    });
});