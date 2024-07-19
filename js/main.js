// Variables y constantes
const URL_TAREAS = 'tasks.json';
const CLAVE_LOCAL_STORAGE_TAREAS = 'tareas';

// Inicializar tareas del almacenamiento local
const obtenerTareas = () => JSON.parse(localStorage.getItem(CLAVE_LOCAL_STORAGE_TAREAS)) || [];
const guardarTareas = (tareas) => localStorage.setItem(CLAVE_LOCAL_STORAGE_TAREAS, JSON.stringify(tareas));

// Crear elemento de tarea
const crearElementoTarea = (tarea, tipo) => {
    const li = document.createElement('li');
    li.className = `list-group-item ${tipo}`;
    li.innerHTML = `
        <span>${tarea.nombre}</span>
        <div class="acciones">
            <button class="btn btn-sm ${tipo === 'completada' ? 'boton-pendiente' : 'boton-completada'}" onclick="alternarEstadoTarea('${tarea.nombre}')">
                ${tipo === 'completada' ? 'Marcar como Pendiente ⚠️' : 'Marcar como Completada ✓'}
            </button>
            <button class="btn btn-sm btn-danger ms-2" onclick="eliminarTarea('${tarea.nombre}')">Eliminar X</button>
        </div>
    `;
    return li;
};

// Renderizar tareas
const renderizarTareas = () => {
    const listaPendientes = document.getElementById('lista-tareas-pendientes');
    const listaCompletadas = document.getElementById('lista-tareas-completadas');
    listaPendientes.innerHTML = '';
    listaCompletadas.innerHTML = '';

    const tareas = obtenerTareas();
    tareas.forEach(tarea => {
        const elementoTarea = crearElementoTarea(tarea, tarea.completada ? 'completada' : 'incompleta');
        if (tarea.completada) {
            listaCompletadas.appendChild(elementoTarea);
        } else {
            listaPendientes.appendChild(elementoTarea);
        }
    });
};

// Añadir tarea
const añadirTarea = (nombreTarea) => {
    const tareas = obtenerTareas();
    tareas.push({ nombre: nombreTarea, completada: false });
    guardarTareas(tareas);
    renderizarTareas();
};

// Eliminar tarea
const eliminarTarea = (nombreTarea) => {
    Swal.fire({
        title: 'Confirmación',
        text: `¿Estás seguro de que quieres eliminar la tarea '${nombreTarea}'?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            const tareas = obtenerTareas().filter(tarea => tarea.nombre !== nombreTarea);
            guardarTareas(tareas);
            renderizarTareas();
            Swal.fire('Eliminado', `La tarea '${nombreTarea}' ha sido eliminada.`, 'success');
        }
    });
};

// Alternar estado de tarea
const alternarEstadoTarea = (nombreTarea) => {
    Swal.fire({
        title: 'Confirmación',
        text: `¿Estás seguro de que quieres marcar la tarea '${nombreTarea}' como ${obtenerTareas().find(tarea => tarea.nombre === nombreTarea).completada ? 'pendiente' : 'completada'}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            const tareas = obtenerTareas().map(tarea => {
                if (tarea.nombre === nombreTarea) {
                    return { ...tarea, completada: !tarea.completada };
                }
                return tarea;
            });
            guardarTareas(tareas);
            renderizarTareas();
            Swal.fire('Actualizado', `La tarea '${nombreTarea}' ha sido marcada como ${obtenerTareas().find(tarea => tarea.nombre === nombreTarea).completada ? 'completada' : 'pendiente'}.`, 'success');
        }
    });
};

// Manejar el envío del formulario
document.getElementById('formulario-tarea').addEventListener('submit', (evento) => {
    evento.preventDefault();
    const entradaTarea = document.getElementById('entrada-tarea');
    const nombreTarea = entradaTarea.value.trim();
    if (nombreTarea) {
        añadirTarea(nombreTarea);
        entradaTarea.value = '';
    }
});

// Cargar tareas desde JSON local
document.addEventListener('DOMContentLoaded', () => {
    if (obtenerTareas().length === 0) {
        fetch(URL_TAREAS)
            .then(response => response.json())
            .then(datos => {
                guardarTareas(datos);
                renderizarTareas();
            })
            .catch(() => Swal.fire('Error', 'No se pudieron cargar las tareas', 'error'));
    } else {
        renderizarTareas();
    }
});