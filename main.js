var accion = "Nuevo",
    id = 0;

document.addEventListener("DOMContentLoaded", () => {
    txtBuscarAlumno.addEventListener("keyup", (e) => {
        mostrarAlumnos(e.target.value);
    });
    frmAlumnos.addEventListener("submit", (e) => {
        e.preventDefault();
        guardarAlumno();
    });
    frmAlumnos.addEventListener("reset", () => {
        limpiarFormulario();
    });
    mostrarAlumnos();
});
function mostrarAlumnos(buscar = '') {
    let $tblAlumnos = document.querySelector("#tblAlumnos tbody"),
        n = localStorage.length,
        filas = "";
    $tblAlumnos.innerHTML = "";
    for (let i = 0; i < n; i++) {
        let key = localStorage.key(i);
        // Validamos que la clave sea un número (nuestros IDs) para evitar errores con otros datos en localStorage
        if (!isNaN(Number(key))) {
            let data = JSON.parse(localStorage.getItem(key));

            if (data.nombre.toUpperCase().includes(buscar.toUpperCase()) ||
                data.codigo.toUpperCase().includes(buscar.toUpperCase())) {
                filas += `
                    <tr onclick='modificarAlumno(${JSON.stringify(data)})'>
                        <td>${data.codigo}</td>
                        <td>${data.nombre}</td>
                        <td>${data.direccion}</td>
                        <td>${data.email}</td>
                        <td>${data.telefono}</td>
                        <td>
                            <button class="btn btn-danger" onclick='eliminarAlumno(${data.id}, event)'>DEL</button>
                        </td>
                    </tr>
                `;
            }
        }
    }
    $tblAlumnos.innerHTML = filas;
}

function eliminarAlumno(id, event) {
    event.stopPropagation();
    if (confirm("¿Está seguro de eliminar el alumno?")) {
        localStorage.removeItem(id);
        mostrarAlumnos();
    }
}

function modificarAlumno(alumno) {
    accion = "Modificar";
    id = alumno.id;
    txtCodigoAlumno.value = alumno.codigo;
    txtnombreAlumno.value = alumno.nombre;
    txtDireccionAlumno.value = alumno.direccion;
    txtEmailAlumno.value = alumno.email;
    txtTelefonoAlumno.value = alumno.telefono;
}
function guardarAlumno() {
    let datos = {
        id: accion == "Modificar" ? id : getId(),
        codigo: txtCodigoAlumno.value,
        nombre: txtnombreAlumno.value,
        direccion: txtDireccionAlumno.value,
        email: txtEmailAlumno.value,
        telefono: txtTelefonoAlumno.value
    }, codigoDuplicado = buscarAlumno(datos.codigo);
    if (codigoDuplicado && accion == "Nuevo") {
        alert("El codigo del alumno ya existe, " + codigoDuplicado.nombre);
        return; //Termina la ejecucion de la funcion
    }
    localStorage.setItem(datos.id, JSON.stringify(datos));
    limpiarFormulario();
    mostrarAlumnos();
}

function getId() {
    return new Date().getTime();
}

function limpiarFormulario() {
    accion = "Nuevo";
    id = 0;
    txtCodigoAlumno.value = "";
    txtnombreAlumno.value = "";
    txtDireccionAlumno.value = "";
    txtEmailAlumno.value = "";
    txtTelefonoAlumno.value = "";
}

function buscarAlumno(codigo = '') {
    let n = localStorage.length;
    for (let i = 0; i < n; i++) {
        let key = localStorage.key(i);
        if (!isNaN(Number(key))) { // Solo buscamos en nuestras llaves numéricas
            try {
                let datos = JSON.parse(localStorage.getItem(key));
                if (datos?.codigo && datos.codigo.trim().toUpperCase() == codigo.trim().toUpperCase()) {
                    return datos;
                }
            } catch (e) { }
        }
    }
    return null;
}
